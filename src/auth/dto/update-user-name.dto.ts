import { PickType } from '@nestjs/swagger';

import { SignUpDto } from './sign-up.dto';

export class UpdateUserNameDto extends PickType(SignUpDto, ['name']) {}
