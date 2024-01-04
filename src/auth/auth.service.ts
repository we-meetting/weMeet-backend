import { ConflictException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user/users.service';

import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    private bycryptNumber: number;
    constructor(private readonly usersService: UsersService) {
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
}
