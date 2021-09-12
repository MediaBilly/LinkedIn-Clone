import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { Notification } from './entities/notification.entity';
import { Skill } from './entities/skill.entity';
import { Education } from './entities/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendRequest, Friendship, Notification, Skill, Education])],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController]
})
export class UsersModule {}
