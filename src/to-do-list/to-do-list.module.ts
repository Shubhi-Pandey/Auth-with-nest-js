import { Module } from '@nestjs/common';
import { ToDoListController } from './to-do-list.controller';
import { ToDoListService } from './to-do-list.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServiceJwt } from './jwt.service';

@Module({

  imports: [
    MulterModule.register({
      dest: './uploads', // Define the upload destination directory
    }),
  ],
  controllers: [ToDoListController],
  providers: [ToDoListService,ServiceJwt]
})
export class ToDoListModule {}
