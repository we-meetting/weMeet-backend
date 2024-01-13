import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

import { Response } from 'express';

export interface MessageType {
  message: string | { error: string; statusCode: number; message: string | string[] };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse() as MessageType;

    const filterMessage = (message: MessageType) => {
      switch (typeof message) {
        case 'string':
          return message;
        case 'object':
          return Array.isArray(message.message) ? message.message[0] : message.message;
        default:
          return exception.message;
      }
    };

    response.status(status).json({
      status: 'FAILED',
      message: filterMessage(message),
      result: null,
    });
  }
}
