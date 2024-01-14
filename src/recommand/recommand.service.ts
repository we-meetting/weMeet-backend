import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { GenerateRecommandDto } from './dto';

@Injectable()
export class RecommandService {
  private readonly openai: OpenAI;
  private readonly messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_SECRET_KEY'),
    });
  }

  private systemContent(roleType: string) {
    return `요청은 지역에 대해서 올 것이고 너는 요청에 맞춰 근처에 추천하는 할 일이나 먹거리 장소를 추천해줘. 
      응답하기 전에 지켜야하는 규칙들이 몇 가지 있어.
  
      1. JSON 형식으로 답변해야해 
      2. 장소 이름을 제외하고 띄어쓰기나 \n을 제거해줘
      3. 장소 이름 앞에 숫자를 적어줘
      4. 구체적인 장소와 구체적인 위치만 명시하고 추가적인 설명을 붙이지마
      5. 단순히 ${roleType}만 답변하고 서론이나 결론은 답변하지마
      6. 모든 장소 이름은 한국어 답변해
      7. 딱 10개의 결과를 답변해
      8. JSON 형식은 {"${roleType} 숫자": {이름: ${roleType}이름, 위치: ${roleType} 구체적인 위치 (예시: 서울특별시 마포구 서교동 332-4)}} 이렇게 답변해
      `;
  }

  public async generateRecommand({ city, district, region, isTodo }: GenerateRecommandDto) {
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
      throw new InternalServerErrorException('서버에 문제가 생겼어요.');
    }
  }
}
