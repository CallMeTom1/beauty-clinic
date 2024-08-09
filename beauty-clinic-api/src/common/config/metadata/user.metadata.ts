import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {UserRequest} from "@common/config/metadata/user-req.interface";
import {AUTH_COOKIE_NAME} from "@common/config";

export const UserReq = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<UserRequest> => {
        const request = ctx.switchToHttp().getRequest();
        const cookie: string = JSON.stringify(request.cookies[AUTH_COOKIE_NAME]);

        if (!cookie) {
            return null;
        }

        const { token, user } = JSON.parse(cookie);

        return {
            ...user,
            token
        };
    },
);