import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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
        return this.usersRepository.findOne(id);
    }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where: {email: email}});
    }
}
