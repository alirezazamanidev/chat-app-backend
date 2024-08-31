import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { MessageEntity } from "./message.entity";
import { EntityName } from "src/common/enums/EntityNames.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityName.Room)
export class RoomEntity extends BaseEntity {

    @Column({unique:true})
    name:string

    @OneToMany(()=>MessageEntity,msg=>msg.room)
    messages:MessageEntity[]
    @ManyToMany(()=>UserEntity,user=>user.rooms,{onDelete:'CASCADE'})
    @JoinTable({
        name:'roomParticipantsUser',
        joinColumn: {
            name: 'roomId',
            referencedColumnName: 'id',
          },
          inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
          },
    })
    participants:UserEntity[]
}