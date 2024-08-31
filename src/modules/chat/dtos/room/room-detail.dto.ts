import { RoomEntity } from "../../entities/room.entity";
import { MessageDto } from "../message/message.dto";



export class RoomDetailDto extends RoomEntity {
    lastMessage:MessageDto
}