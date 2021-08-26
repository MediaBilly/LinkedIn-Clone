import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

    generateToken(user: User) {
        return this.jwtService.sign({ sub: user.id });
    }

    login(user: User) {
        const { password, ...loggedInUser } = user;
        return {
            access_token: this.generateToken(user),
            user: loggedInUser
        }
    }

    async register(createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        return { 
            access_token: this.generateToken(newUser),
            new_user: newUser
        }
    }
}
