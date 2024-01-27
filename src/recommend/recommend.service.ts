import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { GenerateRecommendDto } from './dto';

@Injectable()
export class RecommendService {
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_SECRET_KEY'),
      timeout: 1000 * 60 * 30,
    });
  }

  private systemContent(roleType: string) {
    return `요청은 지역에 대해서 올 것이고 너는 요청에 맞춰 근처에 추천하는 할 일이나 먹거리 장소를 추천해줘. 
      응답하기 전에 지켜야하는 규칙들이 몇 가지 있어.
  
      1. 장소 이름을 제외하고 띄어쓰기나 \n을 제거해줘
      2. 구체적인 장소와 구체적인 위치만 명시하고 추가적인 설명을 붙이지마
      3. 단순히 ${roleType}만 답변하고 서론이나 결론은 답변하지마
      4. 딱 28개의 결과를 답변해 
      5. 모두 한국어로 대답해
      6. 실제 있는 장소와 가게 이름과 위치를 답해 
      7. JSON 형식은 [{"name": ${roleType}이름, "location": ${roleType} 구체적인 위치 (예시: 서울특별시 마포구 서교동 332-4)}] 이런식으로 28개의 아이템이 담긴 배열 형식으로 답변해
      `;
  }

  public async generateRecommend({ city, district, region, isTodo }: GenerateRecommendDto) {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: this.systemContent(isTodo ? '할 일' : '맛집'),
          },
          {
            role: 'user',
            content: `${city} ${district} ${region}에 ${isTodo ? '할 일' : '맛집'}을 추천해줘.
          너는 최고의 ${isTodo ? '할 일' : '맛집'} 추천해주는 bot이야`,
          },
          {
            role: 'assistant',
            content: 'Sure, I will follow all rules.',
          },
        ],
        model: 'gpt-3.5-turbo',
        n: 1,
      });

      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('서버에 문제가 생겼어요');
    }
  }
}
