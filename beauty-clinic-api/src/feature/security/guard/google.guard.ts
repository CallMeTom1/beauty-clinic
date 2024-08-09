import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google'){
    async canActivate(context:ExecutionContext): Promise<boolean> {
        return (await super.canActivate(context)) as boolean;
    }
}