import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobAlert } from './entities/job-alert.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { JobApplication } from './entities/job-application.entity';

@Module({
    imports: [TypeOrmModule.forFeature([JobAlert, JobApplication]), UsersModule, CompaniesModule],
    providers: [JobsService],
    exports: [JobsService],
    controllers: [JobsController]
})
export class JobsModule {}
