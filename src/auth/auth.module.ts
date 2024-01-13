import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@common/prisma';

import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Straties from './strategies';

@Module({
  imports: [UsersModule, ConfigModule, JwtModule.register({}), PrismaModule, PassportModule],
  providers: [AuthService, ...Object.values(Straties)],
  controllers: [AuthController],
})
export class AuthModule {}
