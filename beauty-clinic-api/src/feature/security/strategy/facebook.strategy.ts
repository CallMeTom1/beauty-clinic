import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { ConfigKey, configManager } from "@common/config";
import {encryptData} from "@feature/security/service";
import {SignsocialPayload} from "@feature/security/data";
import {FacebookAuthException} from "@feature/security/security.exception";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {

    constructor() {
        super({
            clientID: configManager.getValue(ConfigKey.FACEBOOK_ID_CLIENT),
            clientSecret: configManager.getValue(ConfigKey.FACEBOOK_SECRET_CODE),
            callbackURL: configManager.getValue(ConfigKey.FACEBOOK_CALL_BACK_URL),
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'emails' ]
        });
    }
    async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done : any): Promise<any> {
        try {
            const hashId: string = encryptData(profile.id);
            const email: string = profile.emails?.[0]?.value;
            const payload: SignsocialPayload = {
                //username: profile.displayName,
                mail: email ?? '',
                googleHash: '',
                facebookHash: hashId,
            };
            done(null, payload);
        } catch (e) {
            done(e, null);
            throw new FacebookAuthException();
        }
    }
}