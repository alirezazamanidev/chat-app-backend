import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { RoomEntity } from './entities/room.entity';
import { ConnectedUserService } from './services/connectedUser.service';
import { ConnectedUserEntity } from './entities/connectedUser.entity';
import { RoomService } from './services/room.service';
import { MessageService } from './services/message.service';

@Module({
  imports:[TypeOrmModule.forFeature([MessageEntity,RoomEntity,ConnectedUserEntity])],
  providers: [ChatGateway,ConnectedUserService,RoomService,MessageService],
})
export class ChatModule {}
