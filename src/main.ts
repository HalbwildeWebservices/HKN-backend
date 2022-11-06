import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ServerOptions, createServer } from 'spdy'
import { readFileSync } from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {

  const express = require('express');
  const expressApp = express();

  const keyPath = process.env.KEY; 
  const certPath = process.env.CERT;
  const spdyOptions : ServerOptions = {
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
  };

  const server = createServer(spdyOptions, expressApp);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {cors: true});
  const swaggerUserApiConfig = new DocumentBuilder()
    .setTitle('HKN user API')
    .setDescription('The HKN user management REST API')
    .addTag('users')
    .addTag('auth')
    .setVersion('0.1')
    .build();
  const swaggerUserDoc = SwaggerModule.createDocument(app, swaggerUserApiConfig);
  SwaggerModule.setup('userapi', app, swaggerUserDoc);
  app.useGlobalPipes(new ValidationPipe({enableDebugMessages: true}))
  const port = process.env.PORT;
  await app.init();
  server.listen(port);
  server.on('listening', () => console.log(`Application is running on port ${port}`));
}


bootstrap();
