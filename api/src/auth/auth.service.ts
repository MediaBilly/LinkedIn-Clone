import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<User|null> {
        const user = await this.usersService.findLoginUser(email);
        if (user) {
            const passwordOk = await this.usersService.checkPassword(user, pass);
            return passwordOk ? user : null;
        } 
        return null;
    }

    // Serialize jwt
    async login(user: User) {
        const payload = { sub: user.id };
        const loggedInUser: User = await this.usersService.findOne(payload.sub);
        return {
            access_token: this.jwtService.sign(payload),
            user: loggedInUser
        }
    }
}
