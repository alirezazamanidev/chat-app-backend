import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dtos/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';
import { AuthMessage, PublicMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  async signUp(signupDto: SignUpDto) {
    let { fullname, phone } = signupDto;

    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepository.create({
        fullname: fullname,
        username: `${fullname}-${randomInt(10000, 999999)}`,
        phone,
      });
      user = await this.userRepository.save(user);
    }
    
    let otp = await this.createOtpForUser(user.id);

    return {
        message:PublicMessage.SendOtp,
        code:otp.code
    }
  }

  async createOtpForUser(userId: string) {
    let otp = await this.otpRepository.findOneBy({ userId });
    
    let code = randomInt(10000, 99999).toString();
    let expiresIn = new Date(new Date().getTime() + 2 * 60 * 1000);
    let existOtp = false;
    if (otp) {
      existOtp = true;
      if (otp.expiresIn > new Date())
        throw new UnauthorizedException(AuthMessage.NotEppiredOtpCode);
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({ userId, code, expiresIn });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    return otp;
  }
}
