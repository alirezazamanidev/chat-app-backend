import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { Column, Entity, OneToMany } from "typeorm";
import { MessageEntity } from "./message.entity";
import { EntityName } from "src/common/enums/EntityNames.enum";

@Entity(EntityName.Room)
export class RoomEntity extends BaseEntity {

    @Column({unique:true})
    name:string

    @OneToMany(()=>MessageEntity,msg=>msg.room)
    messages:MessageEntity[]

}