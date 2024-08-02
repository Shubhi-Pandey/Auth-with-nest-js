import { Test, TestingModule } from '@nestjs/testing';
import { ToDoListController } from './to-do-list.controller';

describe('ToDoListController', () => {
  let controller: ToDoListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToDoListController],
    }).compile();

    controller = module.get<ToDoListController>(ToDoListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
