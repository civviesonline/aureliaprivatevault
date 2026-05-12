import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, validationSchema } from './config/app.config';
import { HealthModule } from './health/health.module';
import { RootModule } from './root/root.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    HealthModule,
    RootModule,
  ],
})
export class AppModule {}
