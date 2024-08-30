import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsString, Length } from "class-validator";

export class SignUpDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(3,20)
    fullname:string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsMobilePhone('fa-IR')
    phone:string
}