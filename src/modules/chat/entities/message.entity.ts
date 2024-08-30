import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RoomEntity } from "./room.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { EntityName } from "src/common/enums/EntityNames.enum";

@Entity(EntityName.Message)
export class MessageEntity extends BaseEntity {

    @Column()
    senderId:string
    @Column()
    text:string
    @Column()
    roomId:string
    @ManyToOne(()=>RoomEntity,room=>room.messages,{onDelete:'CASCADE'})
    @JoinColumn({name:'roomId'})
    room:RoomEntity
    @ManyToOne(()=>UserEntity,{onDelete:'CASCADE'})
    @JoinColumn({name:'senderId'})
    sender:UserEntity
    @CreateDateColumn()
    created_at:Date
}