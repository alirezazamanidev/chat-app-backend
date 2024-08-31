import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entities/room.entity';
import { DataSource, Repository } from 'typeorm';
import { EntityName } from 'src/common/enums/EntityNames.enum';
import { WsException } from '@nestjs/websockets';
import { RoomDetailDto } from '../dtos/room/room-detail.dto';
import { MessageService } from './message.service';
import { plainToInstance } from 'class-transformer';
import { CreateRoomDto } from '../dtos/room/create-room.dto';
import { AssignUsersDto } from '../dtos/room/assign-users.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { RoomParticipantsUserEntity } from '../entities/room-participants-user.entity';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private messageService: MessageService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, createRoomDto: CreateRoomDto) {
    const { participants, ...RoomDetails } = createRoomDto;
    try {
      const newRoom = this.roomRepository.create({
        ...RoomDetails,
        createdById: userId,
      });
      const savedRoom = await this.roomRepository.save(newRoom);

      if (participants && participants.length > 0) {
        participants.push(userId);
        await this.assignUsersToRoom(userId, {
          roomId: savedRoom.id,
          participants,
        });
      }
      return savedRoom;
    } catch (error) {
      this.logger.error(`Failed to create room: ${error.message}`, error.stack);
      throw new WsException('Error occurred while creating the room.');
    }
  }
  async findByUserId(userId: string) {
    try {
      const rooms = await this.roomRepository
        .createQueryBuilder(EntityName.Room)
        .innerJoin(
          'room.participants',
          'participant',
          'participant.id = :userId',
          { userId },
        )
        .leftJoinAndSelect('room.participants', 'allParticipants')
        .getMany();
      const roomDetailsList: RoomDetailDto[] = [];
      for (const room of rooms) {
        let lastMessageResult = await this.messageService.findByRoomId({
          roomId: room.id,
          first: 0,
          rows: 1,
        });
        let roomDetail = plainToInstance(RoomDetailDto, {
          ...room,
          lastMessage: lastMessageResult.total
            ? lastMessageResult.result[0]
            : null,
        });
        roomDetailsList.push(roomDetail);
      }
      return roomDetailsList;
    } catch (error) {
      this.logger.error(
        `Failed to find rooms for user ID ${userId}: ${error.message}`,
        { userId, errorStack: error.stack },
      );
      throw new WsException(
        'An error occurred while retrieving user rooms. Please try again later.',
      );
    }
  }
  async findOne(userId: string, id: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: { id },
        relations: ['participants', 'participants.connectedUsers', 'messages'],
      });
      if (!room) {
        throw new WsException(`Room with ID "${id}" not found.`);
      }
      const isParticipant = room.participants.some(
        (participant) => participant.id === userId,
      );
      if (!isParticipant) {
        throw new WsException(
          `User with ID "${userId}" is not a participant of room with ID "${id}".`,
        );
      }
      room.participants = room.participants.map((participant) => {
        let { phone, phone_verify, ...sanitizedUser } = participant;
        return sanitizedUser as UserEntity;
      });
      return room;
    } catch (error) {
      this.logger.error(
        `Failed to find room with ID ${id} for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      throw new WsException('Error occurred while retrieving the room.');
    }
  }
  private async assignUsersToRoom(
    userId: string,
    assignUsersDto: AssignUsersDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingParticipants = await queryRunner.manager.find(
        RoomParticipantsUserEntity,
        {
          where: {
            roomId: assignUsersDto.roomId,
          },
        },
      );

      const operationType =
        existingParticipants.length > 0 ? 're-assigned' : 'assigned';

      await queryRunner.manager.delete(RoomParticipantsUserEntity, {
        roomId: assignUsersDto.roomId,
      });
      const participantsToAssign = assignUsersDto.participants.map(
        (participantId) => ({
          roomId: assignUsersDto.roomId,
          userId: participantId,
        }),
      );
      await queryRunner.manager.save(
        RoomParticipantsUserEntity,
        participantsToAssign,
      );
      this.logger.log(
        `Users ${operationType} to room ${assignUsersDto.roomId} successfully.`,
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  }
}
