import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {Response} from "express";
import {HttpArgumentsHost} from "@nestjs/common/interfaces";
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response
            .status(exception.getStatus())
            .json(exception.getResponse());
    }
}