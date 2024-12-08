import { RpcException } from '@nestjs/microservices';
import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost) {
        const context = host.switchToRpc();
        const data = exception.getError();

        const status = typeof data === 'object' && 'statusCode' in data ? data.statusCode : 500;
        const message =
            typeof data === 'string'
                ? data
                : typeof data === 'object' && 'message' in data
                ? data.message
                : 'Internal Server Error';

        return {
            status,
            success: false,
            error: message,
            data: {},
        }
    }
}