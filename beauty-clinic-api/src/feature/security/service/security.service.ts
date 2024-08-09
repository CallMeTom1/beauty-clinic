import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TokenService} from "@feature/security/service/token.service"
import {isNil} from "lodash";
import {Builder} from "builder-pattern";
import {ulid} from "ulid";
import {UserService} from "@feature/user/user.service";
import {User} from "@feature/user/model/entity/user.entity";
import {CreateUserInterface} from "@feature/user/model/payload/create-user.interface";
import {
    CredentialDeleteException,
    CredentialNotFoundException,
    SignupException, SocialSignException,
    UserAlreadyExistException, UserNotFoundException
} from "@feature/security/security.exception";
import {
    Credential,
    Role,
    SignInPayload,
    SignsocialPayload,
    SignupPayload,
    Token,
    UserDetails
} from "@feature/security/data";
import {comparePassword, encryptPassword} from "@feature/security/service/utils";

@Injectable()
export class SecurityService {

    constructor(
        @InjectRepository(Credential) private readonly repository: Repository<Credential>,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {}

    async detail(id: string): Promise<Credential> {
        const result: Credential = await this.repository.findOneBy({credential_id: id});
        if (!(isNil(result))) {
            return result;
        }
        throw new UserNotFoundException();
    }

    async userDetail(userId: string, token: string): Promise<{ user: UserDetails }> {
        const userDetails: User = await this.userService.findUserById(userId);
        if(!userDetails){
            throw new UserNotFoundException();
        }

        const credentials: Credential = await this.getCredentialsByUserId(userId);
        if(!credentials){
            throw new CredentialNotFoundException()
        }

        return {
            user: {
                idUser: userDetails.idUser,
                role: credentials.role,
                token: token,
                profileImage: userDetails.profileImage ? userDetails.profileImage.toString('base64') : null,
                firstname: userDetails.firstname,
                lastname: userDetails.lastname,
                phoneNumber: userDetails.phoneNumber
            }
        };
    }

    async signIn(payload: SignInPayload): Promise<Token | null> {
        const credential : Credential | null = await this.repository.findOneBy({mail: payload.mail});
        if (!credential || !await comparePassword(payload.password, credential.password)) {
            throw new UserNotFoundException();
        }
        return this.tokenService.getTokens(credential);
    }

    async signup(payload: SignupPayload): Promise<Token | null> {
        const existingCredential: Credential = await this.repository.findOneBy({ mail: payload.mail });
        if (existingCredential) {
            throw new UserAlreadyExistException();
        }

        try {
            const createUserInterface: CreateUserInterface = {
                firstname: payload.firstname,
                lastname: payload.lastname,
                phoneNumber: payload.phoneNumber,
            };

            const newUser: User = await this.userService.createUser(createUserInterface);

            const encryptedPassword: string = await encryptPassword(payload.password);
            const newCredential: Credential = Builder<Credential>()
                .credential_id(ulid())
                .user(newUser)
                .password(encryptedPassword)
                .mail(payload.mail)
                .build();

            await this.repository.save(newCredential);

            return this.signIn({
                mail: payload.mail,
                password: payload.password,
                googleHash: '',
                facebookHash: '',
                socialLogin: false,
            });
        } catch (e) {
            throw new SignupException();
        }
    }

    /*
    async signSocial(payload: SignsocialPayload): Promise<Token | null>{
        try {
            let credential: Credential = await this.repository.findOne({
                where: [
                    { googleHash: payload.googleHash },
                    { facebookHash: payload.facebookHash }
                ]
            });

            if (!credential) {
                const newUser: User = await this.userService.createUserFromSocial(payload.username);

                const newCredential: Credential = Builder<Credential>()
                    .credential_id(ulid())
                    .user(newUser)
                    .googleHash(payload.googleHash)
                    .facebookHash(payload.facebookHash)
                    .mail(payload.mail || null)
                    .build();

                credential = await this.repository.save(newCredential);
            }

            return this.tokenService.getTokens(credential);
        } catch(e) {
            console.error(e);
            throw new SocialSignException();
        }
    }
    */
    async refresh(token: string): Promise<Token | null> {
        return this.tokenService.refresh(token);
    }

    async delete(id: string): Promise<void> {
        try {
            const detail: Credential = await this.detail(id);
            await this.tokenService.deleteFor(detail);
            await this.repository.remove(detail);
        } catch (e) {
            throw new CredentialDeleteException();
        }
    }

    async promoteToModerator(userId: string): Promise<void> {
        const credential: Credential = await this.repository.findOne({
            where: { user: { idUser: userId } },
            relations: ['user']
        });

        if (!credential) {
            throw new UserNotFoundException();
        }

        credential.role = Role.MODO;
        await this.repository.save(credential);
    }

    async getCredentialsByUserId(userId: string): Promise<Credential> {
        const credential: Credential = await this.repository.findOne({
            where: { user: { idUser: userId } },
            relations: ['user'],
        });

        if (!credential) {
            throw new UserNotFoundException();
        }

        return credential;
    }

}