import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "../entities/user.entity";
import { UsersService } from "../users.service";

@Injectable()
export class OnlyFriendsGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user = request.user;
        const requestUid = params.id;

        // Insufficient info
        if (!params || !user) {
            return false;
        }

        // Admins
        if (user.role === UserRole.ADMIN) {
            return true;
        }

        // Same user
        if (+user.id === +requestUid) {
            return true;
        }

        // Friends
        return this.usersService.getFriendship(+user.id, +requestUid).then((friendship) => {
            return !!friendship;
        });
    }
}