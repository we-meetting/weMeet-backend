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
