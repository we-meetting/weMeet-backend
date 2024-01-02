import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  @Post('/get-info')
  @HttpCode(HttpStatus.OK)
  async findUserById(@Body('id') id: string) {
    return await this.userService.findUserById(id);
  }
}
