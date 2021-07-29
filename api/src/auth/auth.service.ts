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
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            const passwordOk = await bcrypt.compare(pass,user.password);
            return passwordOk ? user : null;
        } 
        return null;
    }

    // Serialize jwt
    async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
