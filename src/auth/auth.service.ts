import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Role } from '@prisma/client';
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

    const accessToken = this.issueJwtToken({ sub: user.id, role: user.role }, true);
    const refreshToken = this.issueJwtToken({ sub: user.id, role: user.role }, false);
    const isProduction = this.configService.get<string>('NODE_ENV') !== 'dev';

    return {
      accessToken,
      refreshToken,
      refreshCookieOptions: {
        domain: isProduction ? 'localhost' : 'localhost',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
      },
    };
  }

  public issueJwtToken(payload: { sub: string; role: Role }, isAccessToken: boolean) {
    const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const token = this.jwtService.sign(payload, {
      secret: isAccessToken ? accessSecret : refreshSecret,
      expiresIn: isAccessToken ? '2h' : '1d',
    });

    return token;
  }
}
