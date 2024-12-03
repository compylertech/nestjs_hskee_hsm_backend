import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// services
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        // super();

        // If we want to change the login credentials fields.
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({ username: email, password: password });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}