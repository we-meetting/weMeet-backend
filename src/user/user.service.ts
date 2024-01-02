import { Injectable } from '@nestjs/common';

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
  constructor(private readonly prisma: PrismaService) {}

  public async createUser({ name, email, password }: CreateUserDto) {
    return await this.prisma.user.create({
      data: { name, email, password },
      select: selectOptions,
    });
  }

  public async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: selectOptions,
    });
  }
}
