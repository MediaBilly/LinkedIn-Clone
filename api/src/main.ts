import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found-exception.filter';
import { QueryFailedErrorExceptionFilter } from './exception-filters/query-failed-error-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
