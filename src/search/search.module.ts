import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
