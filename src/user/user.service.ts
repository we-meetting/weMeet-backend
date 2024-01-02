import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/common/prisma';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  public async createUser({ name, email, password }: CreateUserDto) {
    return await this.prisma.user.create({
      data: { name, email, password },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }
}
