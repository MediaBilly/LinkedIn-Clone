import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found-exception.filter';
import { QueryFailedErrorExceptionFilter } from './exception-filters/query-failed-error-exception.filter';

async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync('../ssl-cert/localhost/localhost.decrypted.key'),
  //   cert: readFileSync('../ssl-cert/localhost/localhost.crt'),
  // };
  const app = await NestFactory.create(AppModule
  //   , 
  //   {
  //   httpsOptions: httpsOptions
  // }
  );
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
