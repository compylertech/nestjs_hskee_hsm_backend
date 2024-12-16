import { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const formattedResponse = {
            success: false,
            error: '',
            data: '',
        };

        if (typeof exceptionResponse === 'string') {
            formattedResponse.error = exceptionResponse;
        } else if (exceptionResponse && typeof exceptionResponse === 'object') {
            const responseObj = exceptionResponse as Record<string, any>;
            if (Array.isArray(responseObj.message)) {
                formattedResponse.error = responseObj.message.join(', ');
            } else {
                formattedResponse.error = responseObj.message || 'An unexpected error occurred.';
            }
        } else {
            formattedResponse.error = 'An unexpected error occurred.';
        }

        response.status(status).json(formattedResponse);
    }
}
