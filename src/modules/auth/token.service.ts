import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types/payload.type";

@Injectable()
export class TokensService {

    constructor(private readonly jwtService:JwtService){}

    createJwtToken(payload:JwtPayload){
        try {
        return this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '7d',
              });
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}