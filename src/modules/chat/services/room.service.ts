import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { EntityName } from 'src/common/enums/EntityNames.enum';
import { WsException } from '@nestjs/websockets';
import { RoomDetailDto } from '../dtos/room/room-detail.dto';
import { MessageService } from './message.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private messageService: MessageService,
  ) {}

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
        let roomDetail=plainToInstance(RoomDetailDto,{
            ...room,
            lastMessage:lastMessageResult.total ?
            lastMessageResult.result[0]:null
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
}
