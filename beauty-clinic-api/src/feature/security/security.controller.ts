import {Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards,} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {ApiCodeResponse} from '@common/api';
import {UserRequest} from "@common/config/metadata/user-req.interface";
import {SignInPayload, SignsocialPayload, SignupPayload, Token, UserDetails} from "@feature/security/data";
import {SecurityService} from "@feature/security/service";
import {Public, UserReq} from "@common/config/metadata";
import {AUTH_COOKIE_NAME} from "@common/config";
import {FacebookGuard, GoogleAuthGuard} from "@feature/security/guard";

@ApiBearerAuth('access-token')
@ApiTags('Account')
@Controller('account')
export class SecurityController {
    constructor(
        private readonly service: SecurityService
    ) {
    }

    @Public()
    @Post('signin')
    @HttpCode(200)
    public async signIn(@Body() payload: SignInPayload, @Res() res: Response): Promise<void> {
        const token: Token = await this.service.signIn(payload);
        if (!token) {
            res.send({
                result: false,
                code: ApiCodeResponse.SIGNIN_ERROR,
                data: null
            });
        } else {
            res.cookie('Authentication', token, { httpOnly: true, secure: true });
            res.send({
                result: true,
                code: ApiCodeResponse.COMMON_SUCCESS,
                data: token
            });
        }
    }
    @Public()
    @Post('signup')
    @HttpCode(200)
    public async signUp(@Body() payload: SignupPayload, @Res() res: Response): Promise<void> {
        const token: Token = await this.service.signup(payload);
        if (!token) {
            res.send({
                result: false,
                code: ApiCodeResponse.SIGNUP_ERROR,
                data: null
            });
        } else {
            res.cookie('Authentication', token, { httpOnly: true, secure: true });
            res.send({
                result: true,
                code: ApiCodeResponse.COMMON_SUCCESS,
                data: token
            });
        }
    }

    @Get('refresh')
    public async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
        try{

            const reqToken: Token = req.cookies[AUTH_COOKIE_NAME] as Token;
            const token: string = reqToken.token;

            if (!reqToken) {
                res.status(401).send({ result: false, code: ApiCodeResponse.TOKEN_REFRESH_ERROR, data:null });
                return;
            }

            const newToken: Token = await this.service.refresh(token);

            res.cookie('Authentication', newToken, { httpOnly: true, secure: true });
            res.send({ result: true, code: ApiCodeResponse.COMMON_SUCCESS, data:null });

        } catch (error) {
            res.status(500).send({ result: false, code: ApiCodeResponse.TOKEN_REFRESH_ERROR, data:null });
        }
    }

    @Get('me')
    public async me(@UserReq() user: UserRequest):Promise<{user: UserDetails}> {
        return await this.service.userDetail(user.idUser, user.token);
    }
    @UseGuards(FacebookGuard)
    @Public()
    @Get('facebook/login')
    public loginFacebook(): void { }

    /*
    @UseGuards(FacebookGuard)
    @Public()
    @Get('facebook/redirect')
    async SignSocialFacebook(@Req() req: Request, @Res() res: Response): Promise<void> {
        const user: SignsocialPayload = req.user as SignsocialPayload;
        const token: Token = await this.service.signSocial(user);
        if (!token) {
            res.status(401).send("Authentication Failed");
        } else {
            res.cookie('Authentication', token, { httpOnly: true, secure: true });
            res.cookie('auth_front', 'auth')
            res.redirect(`https://localhost:4200/dashboard/home`);
        }
    }
    @UseGuards(GoogleAuthGuard)
    @Public()
    @Get('google/login')
    public loginGoogle(): void { }

    @UseGuards(GoogleAuthGuard)
    @Public()
    @Get('google/redirect')
    async SignSocialGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
        const user: SignsocialPayload = req.user as SignsocialPayload;
        const token: Token = await this.service.signSocial(user);
        if (!token) {
            res.status(401).send("Authentication Failed");
        } else {
            res.cookie('Authentication', token, { httpOnly: true, secure: true });
            res.cookie('auth_front', 'auth')
            res.redirect(`https://localhost:4200/dashboard/home`);
        }
    }
     */
}