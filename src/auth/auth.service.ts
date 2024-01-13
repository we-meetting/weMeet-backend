import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@common/prisma';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/user/users.service';

import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  private bycryptNumber: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    this.bycryptNumber = 10;
  }

  public async signUp({ email, password, name }: SignUpDto) {
    const { isExist: exitsUser } = await this.usersService.isExitsUser({ email });
    if (exitsUser) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashedPassword = await bcrypt.hash(password, this.bycryptNumber);

    const createUser = await this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    return createUser;
  }

  public async signIn({ email, password }: SignInDto) {
    const { isExist: exitsUser, user } = await this.usersService.isExitsUser({ email });
    if (!exitsUser) throw new ConflictException('이메일/비밀번호를 다시 확인해주세요');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new ConflictException('이메일/비밀번호를 다시 확인해주세요');

    return user;
  }

  public async updateLastLoginIp(id: User['id'], ip: string) {
    await this.prismaService.user.update({
      where: { id },
      data: { lastLoginIp: ip, lastLoginAt: new Date() },
    });

    return;
  }

  public async issueLoginTokenSet(user: User) {
    const accessToken = await this.issueJwtToken({ sub: user.id }, true);
    const refreshToken = await this.issueJwtToken({ sub: user.id }, false);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'prod';

    return {
      accessToken,
      refreshToken,
      refreshCookieOption: {
        domain: isProduction ? '127.0.0.1' : '127.0.0.1', // 특정 도메인에서만 쿠키를 전송하도록 설정
        maxAge: 60 * 60 * 24 * 1000, // 24시간 후 만료
        httpOnly: true, // 자바스크립트에서 쿠키에 접근하지 못하도록 설정
        secure: isProduction, // production이면 https만 허용
      },
    };
  }

  public async issueJwtToken(payload: { sub: string }, isAccessToken: boolean) {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const token = this.jwtService.sign(payload, {
      secret: isAccessToken ? accessSecret : refreshSecret,
      expiresIn: isAccessToken ? '2h' : '1d',
    });

    return token;
  }
}
