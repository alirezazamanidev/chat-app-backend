import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { SignUpDto } from './dtos/auth.dto';

@ApiTags(SwaggerTags.Auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  signUp(@Body() signupDto:SignUpDto){
    return this.authService.signUp(signupDto)
  }

}
