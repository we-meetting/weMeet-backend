import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [UserModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
