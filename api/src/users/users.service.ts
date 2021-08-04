import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        newUser.password = await bcrypt.hash(newUser.password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
        return await this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOneOrFail(id);
    }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOneOrFail({where: {email: email}});
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update(+id, updateUserDto);
    }

    checkPassword(user: User, pass: string) {
        return bcrypt.compare(pass,user.password)
    }

    async changePassword(id: number, newPassword: string) {
        const user = await this.usersRepository.findOneOrFail(id);
        const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_HASH_ROUNDS));
        user.password = newPasswordHash;
        return await this.usersRepository.save(user);
    }

    delete(id: number) {
        return this.usersRepository.delete(id);
    }
}
