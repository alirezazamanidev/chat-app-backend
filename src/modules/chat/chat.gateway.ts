import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectedUserService } from './services/connectedUser.service';
import { Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { isJWT } from 'class-validator';
import { AuthMessage } from 'src/common/enums/messages.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/payload.type';
import { WsExceptionFilter } from 'src/common/filters';
import { RoomService } from './services/room.service';
@UseFilters(WsExceptionFilter)

@WebSocketGateway(4600, { cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() server:Server
  constructor(
    private readonly connectedUserService: ConnectedUserService,
    private readonly jwtService: JwtService,
    private readonly roomService:RoomService
  ) {}
  async afterInit() {
    this.logger.log('ChatGateWay initialized!');
    await this.connectedUserService.deleteAll();
  }
  async handleConnection(socket: Socket) {
    try {
      const user = this.authenticateSocket(socket);
      await this.initializeUserConnection(user, socket);
    } catch (error) {
      this.handleConnectionError(socket,error);
    }
  }
  async handleDisconnect(socket:Socket) {
    await this.connectedUserService.delete(socket.id);
    this.logger.log(`Client disconnected: ${socket.id}`);
  }
  private handleConnectionError(socket: Socket, error: Error): void {
    this.logger.error(
      `Connection error for socket ${socket.id}: ${error.message}`,
    );
    socket.emit('exception', 'Authentication error');
    socket.disconnect();
  }

  private async initializeUserConnection(
    userPayload: JwtPayload,
    socket: Socket,
  ) {
    socket.data.user=userPayload;
    await this.connectedUserService.create(userPayload.userId, socket.id);
    const rooms=await this.roomService.findByUserId(userPayload.userId);
    this.server.to(socket.id).emit('userAllRooms',rooms);
    this.logger.log(
      `Client connected: ${socket.id} - User ID: ${userPayload.userId}`,
    );
  }
  private authenticateSocket(socket: Socket) {
    let token = this.extractJwtToken(socket);
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  private extractJwtToken(socket: Socket) {
    const [bearer, token] = socket.handshake.headers?.authorization.split(' ');

    if (bearer.toLocaleLowerCase() !== 'bearer' || !token || !isJWT(token))
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    return token;
  }
}
