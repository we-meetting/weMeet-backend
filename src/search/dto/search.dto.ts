import { IsNotEmpty, IsString } from 'class-validator';

export class SearchDto {
  @IsString({ message: '올바른 가게 이름을 입력해주세요' })
  @IsNotEmpty({ message: '가게 이름은 필수 입력 값이에요' })
  readonly name: string;
}
