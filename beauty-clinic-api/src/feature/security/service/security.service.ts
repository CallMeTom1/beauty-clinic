import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
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
    SignupException,
    UserAlreadyExistException,
    UserNotFoundException
} from "@feature/security/security.exception";
import {Credential, Role, SignInPayload, SignupPayload, Token, UserDetails} from "@feature/security/data";
import {comparePassword, encryptPassword} from "@feature/security/service/utils";
import {OAuth2Client} from "google-auth-library";
import * as process from "node:process";
import {ChangePasswordPayload} from "@feature/security/data/payload/change-password.payload";
import {ForgotPasswordPayload} from "@feature/security/data/payload/forgot-password.payload";
import {MailService} from "@feature/security/service/mail.service";
import {ResetPasswordPayload} from "@feature/security/data/payload/reset-password.payload";
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MoreThan } from 'typeorm';

@Injectable()
export class SecurityService {

    private readonly googleClient: OAuth2Client;

    constructor(
        @InjectRepository(Credential) private readonly repository: Repository<Credential>,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly mailService: MailService
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
        const userDetails: User = await this.userService.findUserById(userId);
        if (isNil(userDetails)) {
            throw new UserNotFoundException();
        }

        const credentials: Credential = await this.getCredentialsByUserId(userId);
        if (!credentials) {
            throw new CredentialNotFoundException();
        }

        return {
            user: {
                idUser: userDetails.idUser,
                role: credentials.role,
                token: token,
                profileImage: userDetails.profileImage ? userDetails.profileImage.toString('base64') : null,
                firstname: userDetails.firstname,
                lastname: userDetails.lastname,
                phoneNumber: userDetails.phoneNumber,
                profileImageUrl: userDetails.profileImageUrl,
                hasCustomImage: userDetails.hasCustomProfileImage,
                shippingAddress: userDetails.shippingAddress
                    ? {
                        road: userDetails.shippingAddress.road,
                        nb: userDetails.shippingAddress.nb,
                        cp: userDetails.shippingAddress.cp,
                        town: userDetails.shippingAddress.town,
                        country: userDetails.shippingAddress.country,
                        complement: userDetails.shippingAddress.complement,
                    }
                    : null,
                billingAddress: userDetails.billingAddress
                    ? {
                        road: userDetails.billingAddress.road,
                        nb: userDetails.billingAddress.nb,
                        cp: userDetails.billingAddress.cp,
                        town: userDetails.billingAddress.town,
                        country: userDetails.billingAddress.country,
                        complement: userDetails.billingAddress.complement,
                    }
                    : null,
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
                firstname: '',
                lastname: '',
            };

            const newUser: User = await this.userService.createUser(createUserInterface);

            const encryptedPassword: string = await encryptPassword(payload.password);
            const newCredential: Credential = Builder<Credential>()
                .credential_id(ulid())
                .user(newUser)
                .password(encryptedPassword)
                .mail(payload.mail)
                .build();

            // Générer un token de vérification d'email unique
            // Générer un jeton de vérification d'email unique
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // Le jeton expire dans 24 heures

            newCredential.emailVerificationToken = emailVerificationToken;
            newCredential.emailVerificationExpiresAt = expiresAt;

            await this.repository.save(newCredential);

            // Générer un lien de vérification avec l'email
            const verificationLink = `https://localhost:4200/account/verify-email?token=${encodeURIComponent(emailVerificationToken)}`;
            await this.mailService.sendEmailVerificationEmail(newCredential.mail, verificationLink);


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

    async verifyEmail(token: string): Promise<void> {
        // Récupérer le Credential avec le token fourni
        const credential = await this.repository.findOne({
            where: {
                emailVerificationToken: token
            }
        });

        if (!credential) {
            throw new BadRequestException('Token invalide ou expiré');
        }

        // Vérifier que le token n'est pas expiré
        if (credential.emailVerificationExpiresAt < new Date()) {
            throw new BadRequestException('Token expiré');
        }

        // Mettre à jour l'état de validation de l'email
        credential.is_validated = true;
        credential.emailVerificationToken = null;
        credential.emailVerificationExpiresAt = null;

        await this.repository.save(credential);
    }

    async googleSignIn(idToken: string): Promise<Token> {
        try {
            // Vérifier le jeton d'ID Google
            const ticket = await this.googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_ID_CLIENT, // Utilisez une variable d'environnement
            });
            const payload = ticket.getPayload();

            if (!payload) {
                throw new UnauthorizedException('Échec de la récupération des informations utilisateur depuis le jeton Google.');
            }

            // Valider les champs essentiels
            const { sub: googleId, email, given_name: firstname, family_name: lastname, picture, exp, aud, iss } = payload;

            if (!googleId || !email) {
                throw new UnauthorizedException('Jeton Google invalide: informations utilisateur manquantes.');
            }

            // Validation supplémentaire
            this.validateToken({ exp, aud, iss });

            // Vérifier si l'utilisateur existe déjà
            let credential: Credential = await this.repository.findOne({
                where: { googleHash: googleId },
                relations: ['user'],
            });

            if (!credential) {
                // Utiliser une transaction pour assurer l'atomicité
                await this.repository.manager.transaction(async transactionalEntityManager => {
                    const newUser = new User();
                    newUser.idUser = ulid();
                    newUser.firstname = firstname;
                    newUser.lastname = lastname;
                    newUser.profileImageUrl = picture;

                    const savedUser = await this.userService.createUser(newUser);
                    if (!savedUser) {
                        throw new Error('Échec de la sauvegarde du nouvel utilisateur.');
                    }

                    // Créer de nouvelles informations d'identification
                    credential = new Credential();
                    credential.credential_id = ulid();
                    credential.user = savedUser;
                    credential.googleHash = googleId;
                    credential.mail = email;
                    credential.role = Role.USER;

                    await transactionalEntityManager.save(credential);
                });
            }

            // Générer un jeton pour l'utilisateur
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
        const credential: Credential = await this.repository.findOne({
            where: { user: { idUser: userId } },
            relations: ['user'],
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
            const { email } = payload;

            // Trouver l'utilisateur avec son email
            const credential: Credential = await this.repository.findOneBy({ mail: email });

            // Pour des raisons de sécurité, ne pas révéler si l'email n'existe pas
            if (!credential) {
                // Facultatif : Introduire un délai pour atténuer les attaques par synchronisation
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return;
            }

            // Générer un token aléatoire sécurisé avec crypto
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Hacher le token avec bcrypt avant de le stocker dans la base de données
            const hashedToken = await bcrypt.hash(resetToken, 10);

            // Définir l'heure d'expiration du token (par exemple, 1 heure à partir de maintenant)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            // Stocker le token haché et la date d'expiration dans les informations d'identification
            credential.resetToken = hashedToken;
            credential.resetTokenExpiresAt = expiresAt;

            await this.repository.save(credential);

            // Générer le lien de réinitialisation avec le token non haché
            const resetLink = `https://localhost:4200/account/reset-password?token=${encodeURIComponent(resetToken)}`;

            // Envoyer le lien de réinitialisation de mot de passe par email
            await this.mailService.sendPasswordResetEmail(credential.mail, resetLink);
        } catch (e) {
            // Facultativement, loguer l'erreur
            console.error(e);
        }
    }

    async resetPassword(payload: ResetPasswordPayload): Promise<void> {
        // Rechercher l'utilisateur par le token non haché envoyé dans la requête
        const credential = await this.repository.findOne({
            where: {
                resetTokenExpiresAt: MoreThan(new Date()) // Vérifie que le token n'a pas expiré
            }
        });

        if (!credential) {
            throw new BadRequestException('Invalid or expired token');
        }

        // Comparer le token non haché avec le token haché dans la base de données
        const isTokenValid = await bcrypt.compare(payload.token, credential.resetToken);
        if (!isTokenValid) {
            throw new BadRequestException('Invalid token');
        }

        // Hacher le nouveau mot de passe (avec bcrypt par exemple)
        credential.password = await encryptPassword(payload.newPassword);
        credential.resetToken = null;
        credential.resetTokenExpiresAt = null;

        await this.repository.save(credential);
    }

    /*
    async changePasswordByUserId(userId: string, newPassword: string): Promise<void> {
        const credential: Credential = await this.getCredentialsByUserId(userId);

        if (!credential) {
            throw new UserNotFoundException();
        }

        // Vérification que le nouveau mot de passe est différent de l'ancien
        const isSamePassword: boolean = await comparePassword(newPassword, credential.password);
        if (isSamePassword) {
            throw new Error('Le nouveau mot de passe doit être différent de l\'ancien.');
        }

        // Hachage du nouveau mot de passe
        credential.password = await encryptPassword(newPassword);

        // Sauvegarde du nouveau mot de passe
        await this.repository.save(credential);
    }

     */

}