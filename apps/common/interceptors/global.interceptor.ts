import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { number } from 'joi';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();

        return next.handle().pipe(
            map((data) => {
                if (data && typeof data === 'object' && 'status' in data && typeof data['status'] !== 'string') {
                    response.status(data.status);
                    return data;
                }

                if (Array.isArray(data) || data?.meta) {
                    return {
                        success: true,
                        error: '',
                        data: data?.data || data,
                        meta: data?.meta || null,
                    };
                }

                return {
                    success: true,
                    error: '',
                    data: data,
                };
            }),
        );
    }
}
