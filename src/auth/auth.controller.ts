import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() singUpDto: SignUpDto) {
    return await this.authService.signUp(singUpDto);
  }

  @Post('login')
  async signIn(@Res({ passthrough: true }) res: Response, @Body() singInDto: SignInDto) {
    const { accessToken, refreshToken, refreshCookieOptions } =
      await this.authService.signIn(singInDto);
    res.cookie('token', refreshToken, refreshCookieOptions);
    return { accessToken };
  }
}
