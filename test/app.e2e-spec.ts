/**
 * E2E tests for the auth endpoints.
 *
 * These tests require a running PostgreSQL database and Redis instance.
 * Run them locally with:
 *   docker compose up -d
 *   pnpm test:e2e
 *
 * They are intentionally skipped in the unit-test CI job.
 * A dedicated e2e CI job with service containers will be added in a future iteration.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return 201', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `e2e-${Date.now()}@example.com`,
          password: 'Password123!',
          firstName: 'E2E',
          lastName: 'Test',
        })
        .expect(201)
        .expect((res) => {
          const body = res.body as { data: Record<string, unknown> };
          expect(body.data).toHaveProperty('email');
          expect(body.data).toHaveProperty('message');
        });
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'incomplete@example.com' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should return 401 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'wrong' })
        .expect(401);
    });
  });
});
