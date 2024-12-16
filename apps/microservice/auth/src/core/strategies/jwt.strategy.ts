import { Injectable } from "@nestjs/common";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";

// config
import { JWT_SECRET } from "../configs/jwt-secret";

// services
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        })
    }

    async validate(payload: {sub: string; username: string}): Promise<any> {
        return {userId: payload.sub, username: payload.username}
    }
}