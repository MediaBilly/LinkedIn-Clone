import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { existsSync, unlinkSync } from 'fs';
import { checkImageType, getProfilePicLocation } from './helpers/profile-pic-storage';
import { Notification, NotificationType } from './entities/notification.entity';
import { Skill } from './entities/skill.entity';
import { existsQuery } from 'src/helpers/existsQuery';
import { EducationDto } from './dto/education.dto';
import { Education } from './entities/education.entity';
import { ExperienceDto } from './dto/experience.dto';
import { Experience } from './entities/experience.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { VisibilitySettings } from './entities/visibility-settings.entity';
import { VisibilitySettingsDto } from './dto/visibility-settings.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(FriendRequest) private friendRequestsRepository: Repository<FriendRequest>,
        @InjectRepository(Friendship) private friendshipsRepository: Repository<Friendship>,
        @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
        @InjectRepository(Skill) private skillsRepository: Repository<Skill>,
        @InjectRepository(Education) private educationRepository: Repository<Education>,
        @InjectRepository(Experience) private experienceRepository: Repository<Experience>,
        @InjectRepository(VisibilitySettings) private visibilitySettingsRepository: Repository<VisibilitySettings>,
        private companiesService: CompaniesService
    ) {}

    // Basic Functionality

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        newUser.password = await bcrypt.hash(newUser.password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
        return await this.usersRepository.save(newUser);
    }

    find(query?: string): Promise<User[]> {
        if (query) {
            return this.usersRepository.find({ where: [{ firstname: Like(`%${query}%`) }, { lastname: Like(`%${query}%`) }] });
        } else {
            return this.usersRepository.find();
        }
    }

    async findSome(ids: number[]): Promise<User[]> {
        const q =  this.usersRepository.createQueryBuilder('U')
        .whereInIds(ids)
        .leftJoinAndSelect('U.articles','article')
        .leftJoinAndSelect('U.jobAlerts','jobAlert')
        .leftJoinAndSelect('U.educations','education')
        .leftJoinAndSelect('U.experiences','experience')
        .leftJoinAndSelect('U.articleReactions','reaction')
        .leftJoinAndSelect('reaction.article','r_article')
        .leftJoinAndSelect('U.articleComments','comment')
        .leftJoinAndSelect('comment.article','c_article')
        .leftJoinAndSelect('U.friendsAdded','addedFriend')
        .leftJoinAndSelect('addedFriend.user2', 'connection')
        .leftJoinAndSelect('U.friendsAccepted','acceptedFriend')
        .leftJoinAndSelect('acceptedFriend.user1', 'connection2')
        let result = await q.getMany();
        result.forEach(u => {
            let addedConnections = u.friendsAdded.map(f => f.user2);
            let acceptedConnections = u.friendsAccepted.map(f => f.user1);
            u.connections = Array.prototype.concat(addedConnections, acceptedConnections);
            delete u.friendsAdded;
            delete u.friendsAccepted;
        });
        return result;

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
        return this.deleteProfilePic(id).then(_ => {
            return this.usersRepository.delete(id);
        });
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
                let loc = getProfilePicLocation(user.profilePicName);
                if (existsSync(loc)) {
                    unlinkSync(loc);
                }
                user.profilePicName = null;
                return this.usersRepository.save(user);
            } else {
                return new Promise<User>((resolve, reject) => {
                    resolve(user);
                });
            }
        });
    }

    async getVisibilitySettings(uid: number) {
        const user = await this.usersRepository.findOneOrFail(uid, { relations: ['visibilitySettings'] });
        if (!user.visibilitySettings) {
            let visSettings = this.visibilitySettingsRepository.create();
            visSettings.user = user;
            return this.visibilitySettingsRepository.save(visSettings);
        } else {
            return user.visibilitySettings;
        }
    }

    updateVisibilitySettings(uid: number, visibilitySettingsDto: VisibilitySettingsDto) {
        const userPromise = this.findOne(uid);
        const visibilitySettingsPromise = this.visibilitySettingsRepository.findOne({ where: { user: { id: uid } } });
        return Promise.all([userPromise, visibilitySettingsPromise]).then(([user, visibilitySettings]) => {
            if (!visibilitySettings) {
                visibilitySettings = this.visibilitySettingsRepository.create(visibilitySettingsDto);
                visibilitySettings.user = user;
                return this.visibilitySettingsRepository.save(visibilitySettings);
            } else {
                return this.visibilitySettingsRepository.save({ id: visibilitySettings.id, ...visibilitySettingsDto });
            }
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
        const user2Promise: Promise<User> = this.usersRepository.findOneOrFail(user2Id);
        return Promise.all([user1Promise, user2Promise]).then(([user1, user2]) => {
            const newFriendship = this.friendshipsRepository.create();
            newFriendship.user1 = user1;
            newFriendship.user2 = user2;
            this.sendNotification(user1, NotificationType.ACCEPTED_FRIEND_REQUEST, user2);
            return this.friendshipsRepository.save(newFriendship);
        });
    }

    async getFriends(uid: number) {
        return this.usersRepository.createQueryBuilder('U').where('U.id <> :uid', { uid: uid })
        .andWhere(existsQuery(this.friendshipsRepository.createQueryBuilder('F').where('F.user1Id = :uid', { uid: uid }).andWhere('F.user2Id = U.id')
        .orWhere('F.user2Id = :uid', { uid: uid }).andWhere('F.user1Id = U.id')))
        .leftJoinAndSelect('U.experiences','experience').leftJoinAndSelect('experience.company','company').leftJoinAndSelect('U.educations','education').getMany();
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
        return this.notificationsRepository.find({ where: { receiver: { id: uid } }, order: { receivedAt: 'DESC' } });
    }

    getNotification(id: number): Promise<Notification> {
        return this.notificationsRepository.findOneOrFail(id);
    }

    sendNotification(receiver: User, type: NotificationType, refererUser?: User, refererEntity?: number): Promise<Notification> {
        const notification = this.notificationsRepository.create();
        notification.receiver = receiver;
        notification.type = type;
        if (refererUser) {
            notification.refererUser = refererUser;
        }
        if (refererEntity) {
            notification.refererEntity = refererEntity;
        }
        return this.notificationsRepository.save(notification);
    }

    async readNotification(id: number) {
        const notification = await this.getNotification(id);
        notification.read = true;
        return await this.notificationsRepository.save(notification);
    }

    // Skills

    createSkill(name: string): Promise<Skill> {
        const newSkill = this.skillsRepository.create({ name: name });
        return this.skillsRepository.save(newSkill);
    }

    findSkillWithName(name: string): Promise<Skill> {
        return this.skillsRepository.findOne({ where: { name: name } });
    }

    async addSkills(uid: number, newSkills: string[]) {
        const user = await this.findOne(uid);
        const newSkillPromises: Promise<Skill>[] = [];
        for (let newSkill of newSkills) {
            if (!user.skills.some(s => s.name === newSkill)) {
                let skillObj = await this.findSkillWithName(newSkill);
                if (!skillObj) {
                    skillObj = this.skillsRepository.create({ name: newSkill });
                    newSkillPromises.push(this.skillsRepository.save(skillObj));
                } else {
                    newSkillPromises.push(new Promise<Skill>((resolve, reject) => { resolve(skillObj); }));
                }
            }
        }
        return Promise.all(newSkillPromises).then(newSkillObjs => {
            for (let skill of newSkillObjs) {
                user.skills.push(skill);
            }
            return this.usersRepository.save(user);
        });
    }

    async removeSkillFromUser(uid: number, skillId: number) {
        const user = await this.findOne(uid);
        user.skills.splice(user.skills.findIndex(s => s.id === skillId),1);
        return this.usersRepository.save(user);
    }

    // Education

    async addEducation(uid: number, educationDto: EducationDto) {
        const user = await this.findOne(uid);
        const education = this.educationRepository.create(educationDto);
        return this.educationRepository.save(education).then(edu => {
            user.educations.push(edu);
            return this.usersRepository.save(user);
        });
    }

    async updateEducation(id: number, educationDto: EducationDto) {
        return this.educationRepository.update(id, educationDto);
    }

    removeEducation(uid: number, eduId: number) {
        return this.findOne(uid).then(user => {
            user.educations.splice(user.educations.findIndex(edu => edu.id === eduId), 1);
            return this.usersRepository.save(user);
        });
    }

    // Experience

    async addExperience(uid: number, experienceDto: ExperienceDto) {
        const { company, ...restExperienceData } = experienceDto;
        const user = await this.findOne(uid);
        let companyObj = await this.companiesService.findCompanyByName(company);
        if (!companyObj) {
            companyObj = await this.companiesService.addCompany(company);
        }
        const experience = this.experienceRepository.create({ ...restExperienceData, company: companyObj });
        return this.experienceRepository.save(experience).then(expr => {
            user.experiences.push(expr);
            return this.usersRepository.save(user);
        });
    }

    async updateExperience(id: number, experienceDto: ExperienceDto) {
        const { company, ...restExperienceData } = experienceDto;
        let companyObj = await this.companiesService.findCompanyByName(company);
        if (!companyObj) {
            companyObj = await this.companiesService.addCompany(company);
        }
        return this.experienceRepository.update(id, { ...restExperienceData, company: companyObj });
    }

    removeExperience(uid: number, expId: number) {
        return this.findOne(uid).then(user => {
            user.experiences.splice(user.experiences.findIndex(expr => expr.id === expId), 1);
            return this.usersRepository.save(user);
        });
    }
}
