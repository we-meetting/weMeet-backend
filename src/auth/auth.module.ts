import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@common/prisma';

import { UserModule } from 'src/user/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Straties from './strategies';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({}), PrismaModule, PassportModule],
  providers: [AuthService, ...Object.values(Straties)],
  controllers: [AuthController],
})
export class AuthModule {}
