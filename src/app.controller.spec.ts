import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get(AppController);
  });

  it('returns API metadata', () => {
    const result = controller.getVersionedRoot();
    expect(result.name).toBe('NestJS Starter API');
    expect(result.endpoints).toContain('/items');
  });
});
