import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);

  const apiPrefix = config.getOrThrow<string>('app.apiPrefix');
  const port = config.getOrThrow<number>('app.port');
  const corsOrigins = config.getOrThrow<string[]>('app.corsOrigins');

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (config.get<boolean>('app.swaggerEnabled')) {
    const documentConfig = new DocumentBuilder()
      .setTitle('Velmont Private Bank API')
      .setDescription('Core API foundation for the Velmont Private Bank neobank platform.')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  await app.listen(port);
}

void bootstrap();
