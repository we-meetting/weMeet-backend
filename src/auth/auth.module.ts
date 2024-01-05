import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
