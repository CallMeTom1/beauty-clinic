import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';
import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ConfigKey, configManager} from "@common/config";
import {GoogleAuthException} from "@feature/security/security.exception";
import {SignsocialPayload} from "@feature/security/data";
import {encryptData} from "@feature/security/service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(
    ) {
        super({
            clientID: configManager.getValue(ConfigKey.GOOGLE_ID_CLIENT),
            clientSecret: configManager.getValue(ConfigKey.GOOGLE_SECRET_CODE),
            callbackURL: configManager.getValue(ConfigKey.GOOGLE_CALL_BACK_URL),
            passReqToCallback: true,
            scope: ['email', 'profile'],
        },);
    }

    async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        try{
            const hashId: string = encryptData(profile.id)
            const email: string = profile.emails[0].value;
            const payload: SignsocialPayload = {
                //username: profile.displayName,
                mail : email,
                googleHash: hashId,
                facebookHash: '',
            };
            done(null, payload);
        }
        catch(e) {
            throw new GoogleAuthException();
        }
    }
}




