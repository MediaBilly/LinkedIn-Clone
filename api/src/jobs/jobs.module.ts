import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { JobAlert } from './entities/job-alert.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Company, JobAlert])],
    providers: [JobsService],
    exports: [JobsService],
    controllers: [JobsController]
})
export class JobsModule {}
