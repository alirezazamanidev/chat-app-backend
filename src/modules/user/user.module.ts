import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { OtpEntity } from './entities/otp.entity';

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,OtpEntity])],

    exports:[TypeOrmModule]
})
export class UserModule {}
