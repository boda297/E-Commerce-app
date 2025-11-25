import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
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

  await app.init();
  return app;
}

// Cache the app instance
let cachedApp;

// Export for Vercel serverless
export default async (req, res) => {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }

  const instance = cachedApp.getHttpAdapter().getInstance();
  return instance(req, res);
};

// Local development
if (require.main === module) {
  bootstrap().then((app) => {
    const port = process.env.PORT ?? 3000;
    app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
