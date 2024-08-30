import { BaseEntity } from 'src/common/abstracts/baseEntity.abstract';
import { EntityName } from 'src/common/enums/EntityNames.enum';
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from 'typeorm';
import { OtpEntity } from './otp.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column()
  fullname: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  phone: string;
  @Column({default:false})
  phone_verify:boolean
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column({nullable:true})
  otpId:string
  @OneToOne(()=>OtpEntity,otp=>otp.user,{onDelete:'CASCADE'})
  otp:OtpEntity
}
