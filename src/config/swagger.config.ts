import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, port: number): void => {
  const config = new DocumentBuilder()
    .setTitle('NestJS Auth Starter API')
    .setDescription('NestJS Auth Starter — JWT Authentication API')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token (without the Bearer prefix)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      showRequestDuration: true,
    },
    customSiteTitle: 'NestJS Auth Starter | API Docs',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .scheme-container { background: #1f2937; padding: 20px; margin: 20px 0; }
    `,
  });
};
