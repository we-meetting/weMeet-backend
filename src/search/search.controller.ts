import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';

import { TimeoutInterceptor } from '@common/interceptors';

import { SearchDto } from './dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/')
  @UseInterceptors(TimeoutInterceptor(1000 * 60 * 30))
  public async search(@Query() { name }: SearchDto) {
    return await this.searchService.search({ name });
  }
}
