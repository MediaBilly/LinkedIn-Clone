import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "src/users/entities/user.entity";
import { JobsService } from "../jobs.service";

// Only allows access if the request user is not the creator of the requested job application.
// Used to prevent job creators to apply to their own jobs.

@Injectable()
export class IsNotJobAlertCreatorGuard implements CanActivate {
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

        const jobAlertId = +params.id;
        return this.jobsService.findJobAlert(jobAlertId).then(jobAlert => {
            return jobAlert.creator.id !== +user.id;
        });
    }
}