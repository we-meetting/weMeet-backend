import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';

import { ClientIp } from '@common/decorators/client-ip.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { GetUser, Role } from './decorators';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() singUpDto: SignUpDto) {
    await this.authService.signUp(singUpDto);
    return;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard, RolesGuard)
  @Role(['GUEST'])
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
    @ClientIp() clientIp: string,
  ) {
    const { accessToken, refreshToken, refreshCookieOption } =
      await this.authService.issueLoginTokenSet(user);
    await this.authService.updateLastLoginIp(user.id, clientIp);
    res.cookie('refreshToken', refreshToken, refreshCookieOption);

    return { accessToken };
  }
}
