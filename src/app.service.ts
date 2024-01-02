import { Injectable } from '@nestjs/common';

import { PrismaService } from './common/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const users = await this.prisma.user.findMany();
    return `users: ${users.length}`;
  }
}
