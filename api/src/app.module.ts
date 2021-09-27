import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { RecommendationSystemModule } from './recommendation-system/recommendation-system.module';
import { JobsModule } from './jobs/jobs.module';
import { ChatModule } from './chat/chat.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ArticlesModule,
    RecommendationSystemModule,
    JobsModule,
    ChatModule,
    CompaniesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
