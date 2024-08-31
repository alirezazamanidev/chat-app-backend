import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { EntityName } from "src/common/enums/EntityNames.enum";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity(EntityName.ConnectedUser)
export class ConnectedUserEntity extends BaseEntity {

    @Column()
    userId:string
    @Column()
    socketId:string
    @CreateDateColumn()
    created_at:Date

  
}