import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "../entities/user.entity";
import { UsersService } from "../users.service";


@Injectable()
export class NotificationReceiverGuard implements CanActivate {
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

        const notificationid = params.id;
        return this.usersService.getNotification(+notificationid).then((notification) => {
            return notification.receiver.id === user.id;
        });
    }
}