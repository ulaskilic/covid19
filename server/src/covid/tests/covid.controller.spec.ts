import { Test, TestingModule } from '@nestjs/testing';
import { CovidController } from '../covid.controller';

describe('Covid Controller', () => {
  let controller: CovidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CovidController],
    }).compile();

    controller = module.get<CovidController>(CovidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
