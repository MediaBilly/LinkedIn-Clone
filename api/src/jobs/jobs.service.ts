import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class JobsService {

    constructor(@InjectRepository(Company) private companiesRepository: Repository<Company>) {}

    // Basic functionality

    // Companies

    addCompany(name: string) {
        const companyObj = this.companiesRepository.create({ name: name });
        return this.companiesRepository.save(companyObj);
    }

    findCompanyByName(name: string): Promise<Company> {
        return this.companiesRepository.findOne({ where: { name: name } });
    }
}
