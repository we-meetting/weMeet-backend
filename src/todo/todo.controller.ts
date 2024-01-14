import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { Role } from 'src/auth/decorators';
import { JwtAccessGuard, RoleGuard } from 'src/auth/guards';

import { GenerateResponseDto } from './dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Role(['ANY'])
  @HttpCode(HttpStatus.OK)
  generateResponse(@Body() generateResponseDto: GenerateResponseDto) {
    return this.todoService.generateResponse(generateResponseDto);
  }
}
