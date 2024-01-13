import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';

import { ClientIp } from '@common/decorators/client-ip.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { GetUser, Role } from './decorators';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAccessGuard, JwtRefreshGuard, LocalAuthGuard, RoleGuard } from './guards';

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
  @UseGuards(LocalAuthGuard, RoleGuard)
  @Role(['ANY'])
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
    @ClientIp() clientIp: string,
  ) {
    const { accessToken, refreshToken, refreshCookieOption } =
      await this.authService.issueLoginTokenSet(user);
    await this.authService.updateLastLoginIp(user.id, clientIp);
    res.cookie('token', refreshToken, refreshCookieOption);

    return { accessToken };
  }

  @Post('silent')
  @UseGuards(JwtRefreshGuard, RoleGuard)
  @Role(['USER'])
  async slient(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
    @ClientIp() clientIp: string,
  ) {
    const { accessToken, refreshToken, refreshCookieOption } =
      await this.authService.issueLoginTokenSet(user);
    await this.authService.updateLastLoginIp(user.id, clientIp);
    res.cookie('token', refreshToken, refreshCookieOption);

    return { accessToken };
  }
}
