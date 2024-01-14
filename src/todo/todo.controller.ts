import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  generateResponse(@Body('content') content: string) {
    return this.todoService.generateResponse(content);
  }
}
