import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CheckOtpDto, SendOtpDto } from './dtos/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, randomInt } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';
import { AuthMessage, PublicMessage } from 'src/common/enums/messages.enum';
import { TokensService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly tokenService: TokensService,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    let { phone } = sendOtpDto;

    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepository.create({
        fullname: `${randomBytes(20)}-${randomInt(10000, 999999)}`,
        username: `${randomBytes(20)}-${randomInt(10000, 999999)}`,
        phone,
      });
      user = await this.userRepository.save(user);
    }

    let otp = await this.createOtpForUser(user.id);

    return {
      message: PublicMessage.SendOtp,
      code: otp.code,
    };
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { code, phone } = checkOtpDto;
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: { otp: true },
    });
    if (!user || !user?.otp)
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    const now = new Date();
    const otp = user.otp;
    if (otp.expiresIn < now)
      throw new UnauthorizedException(AuthMessage.ExpiredCode);

    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.OtpCodeIsIncorrect);

    if (!user.phone_verify)
      await this.userRepository.update({ id: user.id }, { phone_verify: true });
    let token = await this.tokenService.createJwtToken({ userId: user.id });
    return {
      message: PublicMessage.LoggedIn,
      token,
    };
  }

  async createOtpForUser(userId: string) {
    let otp = await this.otpRepository.findOneBy({ userId });

    let code = randomInt(10000, 99999).toString();
    let expiresIn = new Date(new Date().getTime() + 2 * 60 * 1000);
    let existOtp = false;
    if (otp) {
      existOtp = true;
      if (otp.expiresIn > new Date())
        throw new UnauthorizedException(AuthMessage.NotExpiredOtp);
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
