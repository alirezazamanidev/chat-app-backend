import { BaseEntity } from 'src/common/abstracts/baseEntity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityName } from 'src/common/enums/EntityNames.enum';

@Entity(EntityName.RoomParticipantsUser)
export class RoomParticipantsUserEntity extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  roomId: string;
}
