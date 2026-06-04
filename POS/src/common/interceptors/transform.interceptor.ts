import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        if (data && data.success === false) {
          return data;
        }

        // For paginated responses with meta, wrap correctly
        if (data && data.meta && data.data) {
          return {
            success: true,
            data: {
              data: data.data,
              meta: data.meta,
            },
            statusCode,
            timestamp: new Date().toISOString(),
          };
        }

        const apiResponse: ApiResponseDto<any> = {
          success: true,
          data,
          statusCode,
          timestamp: new Date().toISOString(),
        };

        return apiResponse;
      }),
    );
  }
}
