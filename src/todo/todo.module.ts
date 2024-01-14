import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [ConfigModule],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
