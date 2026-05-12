import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Velmont API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns root API metadata', async () => {
    await request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          name: 'Velmont Private Bank',
          status: 'online',
        });
      });
  });

  it('returns health status', async () => {
    await request(app.getHttpServer()).get('/api/v1/health').expect(200);
  });
});
