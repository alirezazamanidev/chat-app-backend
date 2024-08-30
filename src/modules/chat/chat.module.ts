import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { RoomEntity } from './entities/room.entity';
import { ConnectedUserService } from './services/connectedUser.service';
import { ConnectedUserEntity } from './entities/connectedUser.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MessageEntity,RoomEntity,ConnectedUserEntity])],
  providers: [ChatGateway,ConnectedUserService],
})
export class ChatModule {}
