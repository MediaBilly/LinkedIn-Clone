import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    providers: [CompaniesService],
    exports: [CompaniesService]
})
export class CompaniesModule {}
