import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { TimeoutInterceptor } from '@common/interceptors';

import { Role } from 'src/auth/decorators';
import { JwtAccessGuard, RoleGuard } from 'src/auth/guards';

import { GetRestuarantsDto } from './dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('/')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Role(['ANY'])
  @UseInterceptors(TimeoutInterceptor(1000 * 60 * 30))
  public async getRestaurants(@Query() { name }: GetRestuarantsDto) {
    const restaurants = await this.restaurantsService.searchRestaurants({ name });
    return restaurants;
  }
}
