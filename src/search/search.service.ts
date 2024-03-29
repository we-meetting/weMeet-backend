import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

import { SearchDto } from './dto';

@Injectable()
export class SearchService {
  private readonly naverApiUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.naverApiUrl = 'https://openapi.naver.com/v1';
  }

  public async search({ keyword: name }: SearchDto) {
    try {
      const { data: localData } = await axios.get(`${this.naverApiUrl}/search/local.json`, {
        params: {
          query: name,
          display: 5,
        },
        headers: {
          'X-Naver-Client-Id': this.configService.get<string>('NAVER_CLIENT_ID'),
          'X-Naver-Client-Secret': this.configService.get<string>('NAVER_CLIENT_SECRET'),
        },
      });

      const results = await Promise.all(
        localData.items.map(async (item) => {
          const { data: imageData } = await axios.get(`${this.naverApiUrl}/search/image.json`, {
            params: {
              query: item.title,
              display: 1,
              filter: 'medium',
            },
            headers: {
              'X-Naver-Client-Id': this.configService.get<string>('NAVER_CLIENT_ID'),
              'X-Naver-Client-Secret': this.configService.get<string>('NAVER_CLIENT_SECRET'),
            },
          });
          return { info: item, image: imageData.items[0] };
        }),
      );

      return results;
    } catch (error) {
      if (error.response.status == 429) {
        throw new HttpException('요청이 너무 빨라요', 429);
      } else {
        console.log(error);
        throw new InternalServerErrorException('서버에 문제가 발생했어요');
      }
    }
  }
}
