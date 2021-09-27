import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { existsQuery } from 'src/helpers/existsQuery';
import { Friendship } from 'src/users/entities/friendship.entity';
import { NotificationType } from 'src/users/entities/notification.entity';
import { Skill } from 'src/users/entities/skill.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { JobAlertDto } from './dto/job-alert.dto';
import { JobApplicationDto } from './dto/job-application.dto';
import { JobAlert } from './entities/job-alert.entity';
import { JobApplication } from './entities/job-application.entity';

@Injectable()
export class JobsService {

    constructor(
        @InjectRepository(JobAlert) private jobAlertsRepository: Repository<JobAlert>,
        @InjectRepository(JobApplication) private jobApplicationsRepository: Repository<JobApplication>,
        @InjectRepository(Friendship) private friendshipsRepository: Repository<Friendship>,
        private companiesService: CompaniesService,
        private usersService: UsersService
    ) {}

    // Basic functionality

    findJobAlert(id: number) {
        return this.jobAlertsRepository.findOneOrFail(id);
    }

    getUserJobAlerts(uid: number) {
        return this.jobAlertsRepository.find({ where: { creator: { id: uid } } });
    }

    getRecommendedJobAlerts(uid: number) {
        return this.jobAlertsRepository.createQueryBuilder('J')
        .innerJoinAndSelect('J.creator', 'creator')
        .innerJoinAndSelect('J.company', 'company')
        .leftJoinAndSelect('J.requiredSkills', 'requiredSkills')
        .where('J.creatorId <> :uid', { uid: uid })
        .andWhere(existsQuery(this.friendshipsRepository.createQueryBuilder('F').where('F.user1Id = :uid', { uid: uid }).andWhere('F.user2Id = J.creator.id')
        .orWhere('F.user2Id = :uid', { uid: uid }).andWhere('F.user1Id = J.creator.id')))
        .getMany();
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
        return this.jobAlertsRepository.findOneOrFail(jobId, { relations: ['applications'] }).then(job => {
            return job.applications;
        });
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
        })
    }

    acceptUserApplication(id: number) {
        return this.findJobApplication(id).then(application => {
            this.usersService.sendNotification(application.applicant, NotificationType.JOB_APPLICATION_ACCEPTED, application.jobAlert.creator, application.id);
            return this.deleteJobApplication(application.id);
        });
    }

    declineUserApplication(id: number) {
        return this.findJobApplication(id).then(application => {
            this.usersService.sendNotification(application.applicant, NotificationType.JOB_APPLICATION_DECLINED, application.jobAlert.creator, application.id);
            return this.deleteJobApplication(application.id);
        });
    }
}
