import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-HTTP-Method-Override',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  return app;
}

// Local development
async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

// Export for Vercel serverless
let cachedApp: any;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    cachedApp = await createApp();
    await cachedApp.init();
  }

  const instance = cachedApp.getHttpAdapter().getInstance();
  return instance(req, res);
};

// Run bootstrap for local development
if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
  });
}
