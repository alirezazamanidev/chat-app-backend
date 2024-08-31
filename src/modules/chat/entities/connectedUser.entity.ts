import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { EntityName } from "src/common/enums/EntityNames.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(EntityName.ConnectedUser)
export class ConnectedUserEntity extends BaseEntity {

    @Column()
    userId:string
    @Column()
    socketId:string
    @CreateDateColumn()
    created_at:Date

    @ManyToOne(() => UserEntity, (user) => user.connectedUsers,{onDelete:'CASCADE'})
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;
}