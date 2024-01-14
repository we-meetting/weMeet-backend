import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RecommandController } from './recommand.controller';
import { RecommandService } from './recommand.service';

@Module({
  imports: [ConfigModule],
  providers: [RecommandService],
  controllers: [RecommandController],
})
export class RecommandModule {}
