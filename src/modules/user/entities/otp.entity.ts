import { BaseEntity } from "src/common/abstracts/baseEntity.abstract";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/EntityNames.enum";

@Entity(EntityName.UserOtp)
export class OtpEntity extends BaseEntity {
    @Column()
    code:string
    @Column()
    expiresIn:Date
    @Column()
    userId:string
    @OneToOne(()=>UserEntity,user=>user.otp)
    @JoinColumn({name:'userId'})
    user:UserEntity
    @CreateDateColumn()
    created_at:Date
}