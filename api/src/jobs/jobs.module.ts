import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { JobAlert } from './entities/job-alert.entity';
import { JobsService } from './jobs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Company, JobAlert])],
    providers: [JobsService],
    exports: [JobsService]
})
export class JobsModule {}
