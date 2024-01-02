import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

// 8자 이상, 숫자 + 특수기호 조합
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

// 한글 2~4자 허용
export const NAME_REGEX = /^[가-힣]{2,4}/;

export class CreateUserDto {
  @IsNotEmpty({ message: '이름은 필수 입력 값이에요' })
  @IsString({ message: '올바른 이름을 입력해주세요' })
  @Matches(NAME_REGEX, { message: '한국어로, 최소 2자, 최대 4자까지 입력할 수 있어요' })
  readonly name: string;

  @IsNotEmpty({ message: '이메일은 필수 입력 값이에요' })
  @IsEmail({}, { message: '올바른 이메일을 입력해주세요' })
  readonly email: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력 값이에요' })
  @IsString({ message: '올바른 비밀번호를 입력해주세요' })
  @Matches(PASSWORD_REGEX, { message: '최소 8자 이상, 숫자와 특수기호를 조합해주세요' })
  readonly password: string;
}
