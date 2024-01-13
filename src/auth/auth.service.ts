import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { SignInDto, SignUpDto, UpdateUserNameDto } from './dto';

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
    if (exitsUser) throw new ConflictException('이미 존재하는 이메일이에요');

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
    if (!exitsUser) throw new UnauthorizedException('이메일/비밀번호를 다시 확인해주세요');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('이메일/비밀번호를 다시 확인해주세요');

    return user;
  }

  public async updateLastLoginIp(id: User['id'], ip: string) {
    await this.usersService.updateUser(id, {
      lastLoginIp: ip,
      lastLoginAt: new Date(),
    });

    return;
  }

  public issueLoginTokenSet(user: User) {
    const accessToken = this.issueJwtToken({ sub: user.id }, true);
    const refreshToken = this.issueJwtToken({ sub: user.id }, false);
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

  public issueJwtToken(payload: { sub: string }, isAccessToken: boolean) {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const token = this.jwtService.sign(payload, {
      secret: isAccessToken ? accessSecret : refreshSecret,
      expiresIn: isAccessToken ? '2h' : '1d',
    });

    return token;
  }

  public formatUser(user: User) {
    delete user.password;

    return user;
  }

  public async updateUsername(id: User['id'], { name }: UpdateUserNameDto) {
    const { isExist, user } = await this.usersService.findById(id);
    if (!isExist) throw new NotFoundException('존재하지 않는 유저에요');

    await this.usersService.updateUser(user.id, { name });
    return;
  }

  public async leave(id: User['id']) {
    const { isExist, user } = await this.usersService.findById(id);
    if (!isExist) throw new NotFoundException('존재하지 않는 유저에요');

    await this.usersService.deleteUser(user.id);
    return;
  }
}
