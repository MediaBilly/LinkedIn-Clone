import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { NotificationType } from 'src/users/entities/notification.entity';
import { Skill } from 'src/users/entities/skill.entity';
import { UsersService } from 'src/users/users.service';
import { Like, Repository } from 'typeorm';
import { JobAlertDto } from './dto/job-alert.dto';
import { JobApplicationDto } from './dto/job-application.dto';
import { JobAlert } from './entities/job-alert.entity';
import { JobApplication } from './entities/job-application.entity';

@Injectable()
export class JobsService {

    constructor(
        @InjectRepository(JobAlert) private jobAlertsRepository: Repository<JobAlert>,
        @InjectRepository(JobApplication) private jobApplicationsRepository: Repository<JobApplication>,
        private companiesService: CompaniesService,
        private usersService: UsersService
    ) {}

    // Basic functionality

    findJobAlert(id: number) {
        return this.jobAlertsRepository.findOneOrFail(id);
    }

    find(query: string) {
        return this.jobAlertsRepository.find({ where: [
            { title: Like(`%${query}%`) }, 
            { description: Like(`%${query}%`) }
        ] });
    }

    getUserJobAlerts(uid: number) {
        return this.jobAlertsRepository.find({ where: { creator: { id: uid } } });
    }

    getRecommendedJobAlerts(uid: number) {
        const userPromise = this.usersService.findOne(uid);
        const resultPromise = this.jobAlertsRepository.createQueryBuilder('J')
        .innerJoinAndSelect('J.creator', 'creator')
        .innerJoinAndSelect('J.company', 'company')
        .leftJoinAndSelect('J.requiredSkills', 'requiredSkills')
        .where('J.creatorId <> :uid', { uid: uid })
        .getMany();
        return Promise.all([userPromise, resultPromise]).then(([user, result]) => {
            result.forEach(job => {
                job.commonSkills = 0;
                for (let userSkill of user.skills) {
                    if (job.requiredSkills.some(s => s.id === userSkill.id)) {
                        job.commonSkills++;
                    }
                }
            });
            return result.filter(job => job.commonSkills > 0);
        });
    }

    async createJobAlert(creatorId: number, jobAlertDto: JobAlertDto) {
        const { companyId, requiredSkills, ...restJobAlertData } = jobAlertDto;
        const creatorPromise = this.usersService.findOne(creatorId);
        const companyPromise = this.companiesService.findById(companyId);
        const [creator, company] = await Promise.all([creatorPromise, companyPromise]);
        if (!creator.experiences.some(e => e.company.id === company.id)) {
            throw new BadRequestException("Request user does not work at the requested company.")
        }
        const jobAlertObj = this.jobAlertsRepository.create(restJobAlertData);
        let skillObjs: Skill[] = [];
        for (let skill of jobAlertDto.requiredSkills) {
            let skillObj = await this.usersService.findSkillWithName(skill);
            if (!skillObj) {
                skillObj = await this.usersService.createSkill(skill);
            }
            skillObjs.push(skillObj);
        }
        jobAlertObj.requiredSkills = skillObjs;
        jobAlertObj.company = company;
        jobAlertObj.creator = creator;
        return this.jobAlertsRepository.save(jobAlertObj);
    }

    deleteJobAlert(id: number) {
        return this.jobAlertsRepository.delete(id);
    }

    // User applications

    getJobApplications(jobId: number) {
        return this.jobApplicationsRepository.find({ where: { jobAlert: { id: jobId } }, order: { created_at: 'DESC' } })
    }

    findJobApplication(id: number) {
        return this.jobApplicationsRepository.findOneOrFail(id);
    }

    deleteJobApplication(id: number) {
        return this.jobApplicationsRepository.delete(id);
    }

    userApply(uid: number, jobId: number, jobApplicationDto: JobApplicationDto) {
        const userPromise = this.usersService.findOne(uid);
        const jobPromise = this.findJobAlert(jobId);
        return Promise.all([userPromise, jobPromise]).then(([user, job]) => {
            const application = this.jobApplicationsRepository.create(jobApplicationDto);
            application.applicant = user;
            application.jobAlert = job;
            return this.jobApplicationsRepository.save(application);
        });
    }

    acceptUserApplication(id: number) {
        return this.findJobApplication(id).then(application => {
            this.usersService.sendNotification(application.applicant, NotificationType.JOB_APPLICATION_ACCEPTED, application.jobAlert.creator, application.jobAlert.id);
            return this.deleteJobApplication(application.id);
        });
    }

    declineUserApplication(id: number) {
        return this.findJobApplication(id).then(application => {
            this.usersService.sendNotification(application.applicant, NotificationType.JOB_APPLICATION_DECLINED, application.jobAlert.creator, application.jobAlert.id);
            return this.deleteJobApplication(application.id);
        });
    }
}
