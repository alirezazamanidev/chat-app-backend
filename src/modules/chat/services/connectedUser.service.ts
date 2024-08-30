import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ConnectedUserEntity } from '../entities/connectedUser.entity';
import { Repository } from 'typeorm';
import { EntityName } from 'src/common/enums/EntityNames.enum';

@Injectable()
export class ConnectedUserService {
  private readonly logger = new Logger(ConnectedUserService.name);
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(userId:string,socketId:string) {
    try {
        const newconnection=this.connectedUserRepository.create({socketId,userId});
        return await this.connectedUserRepository.save(newconnection);
    } catch (ex) {
        this.logger.error(
            `Failed to create connected user for userId ${userId}`,
            ex.stack,
          );
          throw new WsException('Error creating new user connection.');
    }


  }
  async delete(socketId:string) {

    try {
        return await this.connectedUserRepository.delete({ socketId });
      } catch (ex) {
        this.logger.error(
          `Failed to delete the connected user with socketId: ${socketId}`,
          ex.stack,
        );
        throw new WsException('Error removing user connection.');
      }
  }
  async deleteAll() {
    try {
      await this.connectedUserRepository
        .createQueryBuilder(EntityName.ConnectedUser)
        .delete()
        .execute();
    } catch (ex) {
      this.logger.error('Failed to clear the connected user table', ex.stack);
      throw new WsException('Error clearing all user connections.');
    }
  }
}
