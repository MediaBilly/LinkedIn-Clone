import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "src/users/entities/user.entity";
import { ArticlesService } from "../articles.service";

@Injectable()
export class IsArticleReactorGuard implements CanActivate {
    constructor(private articlesService: ArticlesService) {}

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

        const reactionId = params.id;
        return this.articlesService.findArticleReaction(+reactionId).then((reaction) => {
            return reaction.reactor.id === user.id;
        });
    }
}