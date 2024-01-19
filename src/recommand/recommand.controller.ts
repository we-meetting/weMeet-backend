import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { TimeoutInterceptor } from '@common/interceptors';

import { Role } from 'src/auth/decorators';
import { JwtAccessGuard, RoleGuard } from 'src/auth/guards';

import { GenerateRecommandDto } from './dto';
import { RecommandService } from './recommand.service';

@Controller('recommand')
export class RecommandController {
  constructor(private readonly recommandService: RecommandService) {}

  @Post('')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Role(['ANY'])
  @UseInterceptors(TimeoutInterceptor(1000 * 60 * 30))
  @HttpCode(HttpStatus.OK)
  generateRecommand(@Body() generateResponseDto: GenerateRecommandDto) {
    return this.recommandService.generateRecommand(generateResponseDto);
  }
}
