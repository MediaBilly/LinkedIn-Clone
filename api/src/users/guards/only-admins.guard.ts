import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "../entities/user.entity";

export class OnlyAdminsGuard implements CanActivate {
    canActivate(context: ExecutionContext) : boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user.role === UserRole.ADMIN;
    }
}