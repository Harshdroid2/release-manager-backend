import { setupEnvFile } from './utils';

// Load environment variables first, before any other imports
setupEnvFile();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';
import { initDbConnection } from './db/release_manager/DbConnector';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "/", method: RequestMethod.GET }
      ]
  });

  // Enable CORS with credentials for cookie support
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3000'], // Frontend origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  await initDbConnection(app,(e) => {
    console.error(`Database connection error! ${e}`);
  },    async () => {

    void app.listen(4000, () => {
      console.log(`The application is listening on port ${4000}!`);
    });
  });

}
void bootstrap();
