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
import { Experience } from './entities/experience.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { VisibilitySettings } from './entities/visibility-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendRequest, Friendship, Notification, Skill, Education, Experience, VisibilitySettings]), CompaniesModule],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController]
})
export class UsersModule {}
