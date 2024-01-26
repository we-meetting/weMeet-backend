import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';

@Module({
  imports: [ConfigModule],
  providers: [RecommendService],
  controllers: [RecommendController],
})
export class RecommendModule {}
