import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { Response } from "express";
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';

@Catch(QueryFailedError)
export class QueryFailedErrorExceptionFilter implements ExceptionFilter {
    public catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        switch (exception.code) {
            case PG_UNIQUE_VIOLATION:
                const key = exception.detail.split('=')[0].replace('(','').replace(')','').split(' ')[1];
                const value = exception.detail.split('=')[1].replace('(','').replace(')','');
                return response.status(HttpStatus.CONFLICT).json({ message: { error: 'Conflict', message: key + ' ' + value } });
            default: 
                return response.status(HttpStatus.BAD_REQUEST).json({ message: { error: 'Bad Request', message: exception.message } });
        }
    }
}