import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { unlinkSync } from 'fs';
import { checkImageType, getProfilePicLocation } from './helpers/profile-pic-storage';
import { Notification, NotificationType } from './entities/notification.entity';
import { Skill } from './entities/skill.entity';
import { existsQuery } from 'src/helpers/existsQuery';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(FriendRequest) private friendRequestsRepository: Repository<FriendRequest>,
        @InjectRepository(Friendship) private friendshipsRepository: Repository<Friendship>,
        @InjectRepository(Notification) private notificationsRepository: Repository<Notification>
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

    // Find potential logged in user (only query that returns password hash!)
    findLoginUser(email: string): Promise<User | undefined> {
        return this.usersRepository.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email: email }).getOneOrFail();
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update(id, updateUserDto);
    }

    checkPassword(user: User, pass: string) {
        return bcrypt.compare(pass,user.password);
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

    async changeProfilePic(uid: number, picName: string) {
        const ok = await checkImageType(picName);
        if (!ok) {
            unlinkSync(getProfilePicLocation(picName));
            throw new BadRequestException("File content does not match extension.");
        }
        const user = await this.findOne(uid);
        if (user.profilePicName) {
            unlinkSync(getProfilePicLocation(user.profilePicName));
        }
        user.profilePicName = picName;
        return this.usersRepository.save(user);
    }

    deleteProfilePic(uid: number) {
        return this.findOne(uid).then((user) => {
            if (user.profilePicName) {
                unlinkSync(getProfilePicLocation(user.profilePicName));
                user.profilePicName = null;
            }
            return this.usersRepository.save(user);
        })
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
        return Promise.all([user1Promise, user2Promise]).then(([user1, user2]) => {
            const newFriendship = this.friendshipsRepository.create();
            newFriendship.user1 = user1;
            newFriendship.user2 = user2;
            this.sendNotification(user1, NotificationType.ACCEPTED_FRIEND_REQUEST, user2.id);
            return this.friendshipsRepository.save(newFriendship);
        });
    }

    async getFriends(uid: number) {
        return this.usersRepository.createQueryBuilder('U').where('U.id <> :uid', { uid: uid })
        .andWhere(existsQuery(this.friendshipsRepository.createQueryBuilder('F').where('F.user1Id = :uid', { uid: uid }).andWhere('F.user2Id = U.id')
        .orWhere('F.user2Id = :uid', { uid: uid }).andWhere('F.user1Id = U.id'))).getMany();
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

    // Notifications

    getUserNotifications(uid: number) {
        return this.notificationsRepository.createQueryBuilder('N').where('N.receiverId = :uid', { uid: uid }).getMany();
    }

    getNotification(id: number): Promise<Notification> {
        return this.notificationsRepository.findOneOrFail(id);
    }

    sendNotification(receiver: User, type: NotificationType, referer: number): Promise<Notification> {
        const notification = this.notificationsRepository.create();
        notification.receiver = receiver;
        notification.type = type;
        notification.referer = referer;
        return this.notificationsRepository.save(notification);
    }

    async readNotification(id: number) {
        const notification = await this.getNotification(id);
        notification.read = true;
        return await this.notificationsRepository.save(notification);
    }

    // Skills

    async getSkills(uid: number) {
        const user = await this.usersRepository.findOneOrFail(uid, { relations: ['skills'] });
        return user.skills;
    }

    addSkills(uid: number, newSkills: Skill[]) {
        return this.usersRepository.findOneOrFail(uid, { relations: ['skills'] }).then((user) => {
            user.skills.concat(newSkills);
            return this.usersRepository.save(user);
        });
    }
}
