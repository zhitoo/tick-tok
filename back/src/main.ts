import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders:['*'],
    methods:['*']
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory:(errors)=>{
        const formattedErrors = errors.reduce((acc, err)=>{
          acc[err.property] = Object.values(err.constraints).join(
            ', ',
          );
          return acc;
        }, {});
        throw new BadRequestException(formattedErrors);
      }
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
