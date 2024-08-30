import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDBConfig } from './configs/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDBConfig,
      inject: [TypeOrmDBConfig],
    }),
    UserModule,
    AuthModule,
  ],
  providers:[TypeOrmDBConfig]
})
export class AppModule {}
