import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class GenerateResponseDto {
  @IsNotEmpty({ message: '도시 이름은 필수 입력 값이에요' })
  @IsString({ message: '올바른 도시 이름을 입력해주세요' })
  city: string;

  @IsNotEmpty({ message: '구 이름은 필수 입력 값이에요' })
  @IsString({ message: '올바른 구 이름을 입력해주세요' })
  district: string;

  @IsNotEmpty({ message: '사는 지역(동)은 필수 입력 값이에요' })
  @IsString({ message: '올바른 사는 지역(동)을 입력해주세요' })
  region: string;

  @IsNotEmpty({ message: '할 일인지 먹거리인지 선택해주세요' })
  @IsBoolean({ message: '할 일인지 먹거리인지 선택해주세요' })
  isTodo: boolean;
}
