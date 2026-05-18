import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '';
    let code = '';
    let field = null;

    if (typeof exceptionResponse === 'object') {
      const objResponse = exceptionResponse as any;
      message = objResponse.message || exception.message;
      code = objResponse.code || 'UNKNOWN_ERROR';
      field = objResponse.field || null;
    } else {
      message = exceptionResponse;
      code = 'UNKNOWN_ERROR';
    }

    this.logger.error(`[${request.method}] ${request.url} - Status: ${status} - ${message}`);

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        field,
      },
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
