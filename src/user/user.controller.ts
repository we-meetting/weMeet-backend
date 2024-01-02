import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';

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

  @Patch('/update-name')
  @HttpCode(HttpStatus.OK)
  async updateUserName(@Body('id') id: string, @Body('name') name: string) {
    return await this.userService.updateUserName(id, { name });
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Body('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
