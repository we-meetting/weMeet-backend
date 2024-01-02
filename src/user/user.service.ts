import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';

import { CreateUserDto } from './dto/create-user.dto';

const selectOptions = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser({ name, email, password }: CreateUserDto) {
    return await this.prismaService.user.create({
      data: { name, email, password },
      select: selectOptions,
    });
  }

  public async findUserById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: selectOptions,
    });
  }

  public async updateUserName(id: User['id'], data: Partial<Pick<User, 'name'>>): Promise<boolean> {
    const getUser = await this.prismaService.user.findUnique({ where: { id } });
    if (!getUser) {
      return false;
    }
    await this.prismaService.user.update({ data, where: { id } });
    return true;
  }

  public async deleteUser(id: User['id']): Promise<boolean> {
    const getUser = await this.prismaService.user.findUnique({ where: { id } });
    if (!getUser) {
      return false;
    }
    await this.prismaService.user.delete({ where: { id } });
    return true;
  }
}
