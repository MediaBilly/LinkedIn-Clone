import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "src/users/entities/user.entity";
import { JobsService } from "../jobs.service";

// Same as IsJobAlertCreatorGuard but this time the JobAlert is retreived from the job application id

@Injectable()
export class IsJobApplicationsAlertCreatorGuard implements CanActivate {
    constructor(private jobsService: JobsService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user = request.user;
        
        if (!params || !user) {
            return false;
        }

        if (user.role === UserRole.ADMIN) {
            return true;
        }

        const jobApplicationId = +params.id;
        return this.jobsService.findJobApplication(jobApplicationId).then(jobApplication => {
            return jobApplication.jobAlert.creator.id === +user.id;
        });
    }
}