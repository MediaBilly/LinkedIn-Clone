import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(FriendRequest) private friendRequestsRepository: Repository<FriendRequest>,
        @InjectRepository(Friendship) private friendshipsRepository: Repository<Friendship>
    ) {}

    // Basic Functionality

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        newUser.password = await bcrypt.hash(newUser.password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
        return await this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOneOrFail(id);
    }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOneOrFail({where: {email: email}});
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update(id, updateUserDto);
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

    // Friend Requests

    getFrinedRequest(id: number) {
        return this.friendRequestsRepository.findOneOrFail(id);
    }
    
    async getSentFriendRequests(senderId: number) {
        const user: User = await this.usersRepository.findOneOrFail(senderId,{ relations: ['sentFriendRequests'] });
        return user.sentFriendRequests;
    }

    async getReceivedFriendRequests(receiverId: number) {
        const user: User = await this.usersRepository.findOneOrFail(receiverId,{ relations: ['receivedFriendRequests'] });
        return user.receivedFriendRequests;
    }

    async sendFriendRequest(sender: User, receiverId: number) {
        // Check if receiver is the same
        if (sender.id === receiverId) {
            throw new BadRequestException("You can't send a friend request to yourself!");
        }
        // Check if it already exists
        const requestQ = this.friendRequestsRepository.createQueryBuilder('req')
                        .where('req.senderId = :sender',{ sender: sender.id })
                        .andWhere('req.receiverId = :receiver', { receiver: receiverId })
                        .orWhere('req.senderId = :sender2',{ sender2: receiverId })
                        .andWhere('req.receiverId = :receiver2', { receiver2: sender.id });
        const request = await requestQ.getOne();
        if (request) {
            throw new ConflictException();
        }
        // Check if they are already friends
        const friendship = await this.getFriendship(sender.id, receiverId);
        if (friendship) {
            throw new ConflictException();
        }
        const receiver: User = await this.findOne(receiverId);
        const newRequest = this.friendRequestsRepository.create();
        newRequest.sender = sender;
        newRequest.receiver = receiver;
        return await this.friendRequestsRepository.save(newRequest);
    }

    async cancelFriendRequest(id: number) {
        return this.friendRequestsRepository.delete(id);
    }

    async acceptFriendRequest(id: number) {
        const request = await this.friendRequestsRepository.findOneOrFail(id);
        this.friendRequestsRepository.delete(request.id);
        return this.newFriendship(request.sender.id, request.receiver.id);
    }

    async declineFriendRequest(id: number) {
        return this.friendRequestsRepository.delete(id);
    }

    // Friendships

    newFriendship(user1Id: number, user2Id: number) {
        const user1Promise: Promise<User> = this.usersRepository.findOneOrFail(user1Id);
        const user2Promise : Promise<User> = this.usersRepository.findOneOrFail(user2Id);
        Promise.all([user1Promise, user2Promise]).then(([user1, user2]) => {
            const newFriendship = this.friendshipsRepository.create();
            newFriendship.user1 = user1;
            newFriendship.user2 = user2;
            this.friendshipsRepository.save(newFriendship);
        });
    }

    async getFriends(uid: number) {
        return this.usersRepository.query(`SELECT * FROM "user" "U" WHERE "U"."id" <> $1 AND EXISTS 
                                            (SELECT * FROM "friendship" "F" WHERE 
                                                ("F"."user1Id" = $1 AND "F"."user2Id" = "U"."id") OR ("F"."user2Id" = $1 AND "F"."user1Id" = "U"."id")
                                            );`, [uid]);
    }

    async getFriendship(uid: number, withId: number) {
        return await this.friendshipsRepository.createQueryBuilder('F')
                                .where('F.user1Id = :uid', { uid: uid })
                                .andWhere('F.user2Id = :withId', { withId: withId })
                                .orWhere('F.user1Id = :uid2', { uid2: withId })
                                .andWhere('F.user2Id = :withId2', { withId2: uid })
                                .getOne();
    }

    async removeFriend(user1Id: number, user2Id: number) {
        const friendship = await this.getFriendship(user1Id, user2Id);
        if (!friendship) {
            throw new NotFoundException('Not yet friends.');
        }
        return this.friendshipsRepository.remove(friendship);
    }
}
