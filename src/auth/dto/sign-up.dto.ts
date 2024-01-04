import { NAME_REGEX } from '@common/constant';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { AuthCommonDto } from './auth-common.dto';

export class SignUpDto extends AuthCommonDto {
  @IsNotEmpty({ message: '이름은 필수 입력 값이에요' })
  @IsString({ message: '올바른 이름을 입력해주세요' })
  @Matches(NAME_REGEX, { message: '한국어로, 최소 2자, 최대 4자까지 입력할 수 있어요' })
  readonly name: string;
}
