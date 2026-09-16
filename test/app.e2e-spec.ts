import {
  INestApplication,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from '../src/app.controller';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { RootController } from '../src/root.controller';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, RootController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', {
      exclude: [{ path: '/', method: RequestMethod.GET }],
    });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / returns welcome payload', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res: { body: { data: { title: string; apiRoot: string } } }) => {
        expect(res.body.data.title).toBe('NestJS Starter API');
        expect(res.body.data.apiRoot).toBe('/api/v1');
      });
  });
});
