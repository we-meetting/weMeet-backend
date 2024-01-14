import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { Role } from 'src/auth/decorators';
import { JwtAccessGuard, RoleGuard } from 'src/auth/guards';

import { GenerateRecommandDto } from './dto';
import { RecommandService } from './recommand.service';

@Controller('todo')
export class RecommandController {
  constructor(private readonly recommandService: RecommandService) {}

  @Post('')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Role(['ANY'])
  @HttpCode(HttpStatus.OK)
  generateRecommand(@Body() generateResponseDto: GenerateRecommandDto) {
    return this.recommandService.generateRecommand(generateResponseDto);
  }
}
