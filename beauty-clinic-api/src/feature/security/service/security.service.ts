
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import {MoreThan, Repository} from 'typeorm';
import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";
import {InjectRepository} from "@nestjs/typeorm";
import {TokenService} from "@feature/security/service/token.service";
import {UserService} from "@feature/user/user.service";
import {MailService} from "@feature/security/service/mail.service";
import {ResetTokenService} from "@feature/security/service/reset-token.service";
import {isNil} from "lodash";
import {
    CredentialDeleteException,
    CredentialNotFoundException, SignupException,
    UserAlreadyExistException,
    UserNotFoundException
} from "@feature/security/security.exception";
import {Credential, Role, SignInPayload, SignupPayload, Token, UserDetails} from "@feature/security/data";
import {CreateUserInterface, User} from "@feature/user/model";
import {comparePassword, encryptPassword} from "@feature/security/service/utils";
import {Builder} from "builder-pattern";
import {ulid} from "ulid";
import {ChangePasswordPayload} from "@feature/security/data/payload/change-password.payload";
import {ForgotPasswordPayload} from "@feature/security/data/payload/forgot-password.payload";
import {ResetPasswordPayload} from "@feature/security/data/payload/reset-password.payload";

@Injectable()
export class SecurityService {

    private readonly googleClient: OAuth2Client;

    constructor(
        @InjectRepository(Credential) private readonly repository: Repository<Credential>,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly resetTokenService: ResetTokenService

    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_ID_CLIENT);
    }

    async detail(id: string): Promise<Credential> {
        const result: Credential = await this.repository.findOneBy({credential_id: id});
        if (!(isNil(result))) {
            return result;
        }
        throw new UserNotFoundException();
    }

    async userDetail(userId: string, token: string): Promise<{ user: UserDetails }> {
        // Vérifier si le token existe toujours en base
        await this.tokenService.verifyTokenExists(token);

        const user: User = await this.userService.findUserById(userId);
        if (isNil(user)) {
            throw new UserNotFoundException();
        }

        const credentials: Credential = await this.getCredentialsByUserId(userId);
        if (!credentials) {
            throw new CredentialNotFoundException();
        }

        return {
            user: {
                idUser: user.idUser,
                role: credentials.role,
                token: token,
                mail: credentials.mail,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                phonenumber: user.phoneNumber || '',
                addresses: user.addresses || []
            }
        };
    }

    async signIn(payload: SignInPayload): Promise<Token | null> {
        const credential: Credential | null = await this.repository.findOneBy({ mail: payload.mail });
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
                username: payload.username,
                firstname: payload.firstname,
                lastname: payload.lastname,
                email: payload.mail
            };

            const newUser: User = await this.userService.createUser(createUserInterface);

            const encryptedPassword: string = await encryptPassword(payload.password);
            const newCredential: Credential = Builder<Credential>()
                .credential_id(ulid())
                .user(newUser)
                .password(encryptedPassword)
                .mail(payload.mail)
                .role(Role.USER)
                .active(true)
                .build();

            await this.repository.save(newCredential);

            return this.signIn({
                mail: payload.mail,
                password: payload.password,
                googleHash: '',
            });
        } catch (e) {
            console.error('Signup error:', e);
            throw new SignupException();
        }
    }

    async googleSignIn(idToken: string): Promise<Token> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_ID_CLIENT,
            });
            const payload = ticket.getPayload();

            if (!payload) {
                throw new UnauthorizedException('Échec de la récupération des informations utilisateur depuis le jeton Google.');
            }

            const { sub: googleId, email, given_name: firstname, family_name: lastname, picture, exp, aud, iss } = payload;

            if (!googleId || !email) {
                throw new UnauthorizedException('Jeton Google invalide: informations utilisateur manquantes.');
            }

            this.validateToken({ exp, aud, iss });

            let credential: Credential = await this.repository.findOne({
                where: [
                    { googleHash: googleId },
                    { mail: email }
                ],
                relations: ['user', 'user.addresses'],
            });

            if (!credential) {
                await this.repository.manager.transaction(async transactionalEntityManager => {
                    const newUser = new User();
                    newUser.idUser = ulid();
                    newUser.firstname = firstname || '';
                    newUser.lastname = lastname || '';
                    newUser.email = email;
                    newUser.addresses = [];

                    const savedUser = await this.userService.createUser(newUser);
                    if (!savedUser) {
                        throw new Error('Échec de la sauvegarde du nouvel utilisateur.');
                    }

                    credential = new Credential();
                    credential.credential_id = ulid();
                    credential.user = savedUser;
                    credential.googleHash = googleId;
                    credential.mail = email;
                    credential.role = Role.USER;
                    credential.active = true;

                    await transactionalEntityManager.save(credential);
                });
            } else if (!credential.googleHash) {
                credential.googleHash = googleId;
                await this.repository.save(credential);
            }

            return this.tokenService.getTokens(credential);

        } catch (error) {
            console.error('Erreur lors de la vérification du jeton Google:', error);
            throw new UnauthorizedException('Authentification Google échouée');
        }
    }

    //validate google token
    private validateToken(token: { exp: number, aud: string, iss: string }) {
        const currentTime = Math.floor(Date.now() / 1000);

        // Vérification de l'expiration du jeton
        if (token.exp < currentTime) {
            throw new UnauthorizedException('Le jeton Google a expiré.');
        }

        // Vérification de l'émetteur
        const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
        if (!validIssuers.includes(token.iss)) {
            throw new UnauthorizedException('Jeton Google invalide: émetteur incorrect.');
        }
    }

    async refresh(token: string): Promise<Token | null> {
        return this.tokenService.refresh(token);
    }

    async signout(token: string): Promise<void> {
        //supprimer le token en db pour ne plus être auth
        return this.tokenService.revokeToken(token);
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

    async getCredentialsByUserId(userId: string): Promise<Credential> {
        const credential = await this.repository.findOne({
            where: { user: { idUser: userId } },
            relations: ['user', 'user.addresses']
        });

        if (!credential) {
            throw new UserNotFoundException();
        }

        return credential;
    }

    async changePassword(payload: ChangePasswordPayload, userId: string): Promise<void> {
        try {
            const credentials: Credential = await this.getCredentialsByUserId(userId);

            const isMatch: boolean = await comparePassword(payload.oldPassword, credentials.password);
            if (!isMatch) {
                throw new UnauthorizedException('Incorrect old password.');
            }

            const isSamePassword: boolean = await comparePassword(payload.newPassword, credentials.password);
            if (isSamePassword) {
                throw new Error('New password must be different from the old password.');
            }

            credentials.password = await encryptPassword(payload.newPassword);

            await this.repository.save(credentials);

        } catch (error) {
            throw new Error('Failed to change password.');
        }
    }

    async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
        try {
            const credential: Credential = await this.repository.findOne({
                where: { mail: payload.email },
                relations: ['user']
            });

            if (!credential) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return;
            }

            // Créer un nouveau token de réinitialisation
            const plainToken: string = await this.resetTokenService.createToken(credential);

            const resetLink = `https://localhost:4200/account/reset-password?token=${encodeURIComponent(plainToken)}`;
            await this.mailService.sendPasswordResetEmail(credential.mail, resetLink);
        } catch (error) {
            console.error('Error in forgotPassword:', error);
        }
    }


    async resetPassword(payload: ResetPasswordPayload): Promise<void> {
        const resetToken = await this.resetTokenService.findValidToken(payload.token);

        if (!resetToken) {
            throw new BadRequestException('Invalid or expired token');
        }

        // Récupérer les credentials complets avec toutes les relations nécessaires
        const credential = await this.repository.findOne({
            where: { credential_id: resetToken.credential.credential_id },
            relations: ['user']
        });

        if (!credential) {
            throw new BadRequestException('Credential not found');
        }

        // Mettre à jour le mot de passe
        credential.password = await encryptPassword(payload.newPassword);
        await this.repository.save(credential);

        // Invalider le token
        await this.resetTokenService.invalidateToken(resetToken);
    }

}