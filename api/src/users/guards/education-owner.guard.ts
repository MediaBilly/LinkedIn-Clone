import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "../entities/user.entity";
import { UsersService } from "../users.service";


@Injectable()
export class EducationOwnerGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

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

        const educationId = params.id;
        return this.usersService.findOne(+user.id).then(u => {
            return u.educations.some(edu => edu.id === educationId);
        });
    }
}