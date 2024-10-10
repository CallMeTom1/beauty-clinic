import {BadRequestException, forwardRef, Inject, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "@feature/user/model/entity/user.entity";
import {ulid} from "ulid";
import {UserCreationException} from "@feature/user/exception/user.exception";
import {join} from 'path';
import {readFileSync} from 'fs';
import {CreateUserInterface} from "@feature/user/model/payload/create-user.interface";
import {
    FileUploadException,
    InvalidFileTypeException,
    UserNotFoundException
} from "@feature/security/security.exception";
import {ModifyUserPayload} from "@feature/user/model/payload/modify-user.payload";
import {CartService} from "../cart/cart.service";
import {Cart} from "../cart/data/model/cart.entity";
import {CreateCartException} from "../cart/cart.exception";

@Injectable()
export class UserService {

    private readonly defaultProfileImage: Buffer;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,  // Injecter le CartRepository ici

    ) {
        this.defaultProfileImage = readFileSync(join(process.cwd(), 'src', 'feature', 'user', 'assets', 'default-profile.png'));
    }

    async createUser(payload: CreateUserInterface): Promise<User> {
        try {
            const idUser: string = ulid()
            const newUser: User = this.userRepository.create({
                idUser: idUser,
                firstname: payload.firstname,
                lastname: payload.lastname,
                phoneNumber: payload.phoneNumber,
                profileImage: this.defaultProfileImage,
                profileImageUrl: payload.profileImageUrl
            });

            const user: User = await this.userRepository.save(newUser);
            await this.createCart(idUser);
            return user;
        } catch (error) {
            throw new UserCreationException();
        }
    }

    // Méthode déplacée pour créer un panier dans UserService
    async createCart(idUser: string): Promise<Cart> {
        try {
            const user: User = await this.userRepository.findOne({ where: { idUser } });
            if (!user) {
                throw new UserNotFoundException();
            }

            const newCart: Cart = this.cartRepository.create({
                idCart: ulid(),
                user: user
            });

            return await this.cartRepository.save(newCart);
        } catch (error) {
            throw new CreateCartException();
        }
    }

    /*
    async createUserFromSocial(username: string): Promise<User> {
        try {
            const newUser: User = this.userRepository.create({
                idUser: ulid(),
                username,
                profileImage: this.defaultProfileImage
            });

            return this.userRepository.save(newUser);
        } catch (error) {
            throw new UserCreationException();
        }
    }


    */

    async findAllUsersWithoutProfileImage(): Promise<Omit<User, 'profileImage'>[]> {
        return this.userRepository.find({
            select: ['idUser', 'firstname', 'lastname', 'phoneNumber']  // Exclude profileImage
        });
    }


    async findUserById(idUser: string): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { idUser } });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    async updateUserProfileImage(userId: string, file: Express.Multer.File): Promise<any> {

        const user: User = await this.findUserById(userId);

        if (!file) {
            throw new FileUploadException();
        }

        const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
        const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png', '.PNG'];

        if (!allowedMimeTypes.includes(file.mimetype) ||
            !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
            throw new InvalidFileTypeException();
        }

        user.profileImage = Buffer.from(file.buffer);
        user.hasCustomProfileImage = true;

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    async findOne(userId: string): Promise<User> {
        return this.userRepository.findOne({ where: { idUser: userId }, relations: ['wallets', 'wallets.assets'] });
    }

    async modifyUser(userId: string, payload: ModifyUserPayload): Promise<User> {
        const user: User = await this.findUserById(userId);

        if (!user) {
            throw new UserNotFoundException();
        }

        // Mettre à jour uniquement les champs fournis dans le payload
        user.firstname = payload.firstname || user.firstname;
        user.lastname = payload.lastname || user.lastname;
        user.phoneNumber = payload.phoneNumber || user.phoneNumber;

        // Mettre à jour l'adresse de livraison si elle est fournie
        if (payload.shippingAddress) {
            user.shippingAddress = { ...user.shippingAddress, ...payload.shippingAddress };
        }

        // Mettre à jour l'adresse de facturation si elle est fournie
        if (payload.billingAddress) {
            user.billingAddress = { ...user.billingAddress, ...payload.billingAddress };
        }

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


}