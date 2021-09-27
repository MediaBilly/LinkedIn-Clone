import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
    constructor(@InjectRepository(Company) private companiesRepository: Repository<Company>) {}

    addCompany(name: string) {
        const companyObj = this.companiesRepository.create({ name: name });
        return this.companiesRepository.save(companyObj);
    }

    findById(id: number) {
        return this.companiesRepository.findOneOrFail(id);
    }

    findCompanyByName(name: string): Promise<Company> {
        return this.companiesRepository.findOne({ where: { name: name } });
    }
}
