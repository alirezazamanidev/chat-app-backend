import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { CheckOtpDto, SendOtpDto } from './dtos/auth.dto';
@ApiTags(SwaggerTags.Auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  sendOtp(@Body() sendOtpDto:SendOtpDto){
    return this.authService.sendOtp(sendOtpDto)
  }
  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  checkOtp(@Body() checkOtpDto:CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto)
  }
}
