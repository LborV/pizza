import { Test, TestingModule } from '@nestjs/testing';
import { PizzaController } from './pizza.controller';

describe('PizzaController', () => {
  let controller: PizzaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PizzaController],
    }).compile();

    controller = module.get<PizzaController>(PizzaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
