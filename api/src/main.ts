import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found-exception.filter';
import { QueryFailedErrorExceptionFilter } from './exception-filters/query-failed-error-exception.filter';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('../ssl/server.key'),
    cert: readFileSync('../ssl/server.crt'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalFilters(
    new EntityNotFoundExceptionFilter(),
    new QueryFailedErrorExceptionFilter()
  );
  await app.listen(3000);
}
bootstrap();
