import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class UsersService {
  private selectOptions: {
    id: boolean;
    name: boolean;
    email: boolean;
    role: boolean;
  };
  constructor(private readonly prismaService: PrismaService) {
    this.selectOptions = {
      id: true,
      name: true,
      email: true,
      role: true,
    };
  }

  public async isExitsUser({ email }: { email: string }) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    return { isExist: user != null, user: user || null };
  }

  public async createUser({ name, email, password }: SignUpDto) {
    return await this.prismaService.user.create({ data: { name, email, password } });
  }

  public async findById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });
    return { isExist: Boolean(user), user: user || null };
  }

  public async updateUser(
    id: User['id'],
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    return await this.prismaService.user.update({ where: { id }, data });
  }

  public async deleteUser(id: User['id']) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
