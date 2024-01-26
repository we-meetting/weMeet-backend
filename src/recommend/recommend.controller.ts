import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';

import { TimeoutInterceptor } from '@common/interceptors';

import { GenerateRecommendDto } from './dto';
import { RecommendService } from './recommend.service';

@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Post('')
  @UseInterceptors(TimeoutInterceptor(1000 * 60 * 30))
  @HttpCode(HttpStatus.OK)
  generateRecommend(@Body() generateResponseDto: GenerateRecommendDto) {
    return this.recommendService.generateRecommend(generateResponseDto);
  }
}
