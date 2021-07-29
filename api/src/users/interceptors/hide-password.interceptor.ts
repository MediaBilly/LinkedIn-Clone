import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { map, Observable } from "rxjs";

export class HidePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => classToPlain(data)));
    }
} 