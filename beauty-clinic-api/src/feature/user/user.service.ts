import {BadRequestException, Injectable, Logger} from "@nestjs/common";
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

@Injectable()
export class UserService {

    private readonly defaultProfileImage: Buffer;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        this.defaultProfileImage = readFileSync(join(process.cwd(), 'src', 'feature', 'user', 'assets', 'default-profile.png'));
    }

    async createUser(payload: CreateUserInterface): Promise<User> {
        try {
            const newUser: User = this.userRepository.create({
                idUser: ulid(),
                firstname: payload.firstname,
                lastname: payload.lastname,
                phoneNumber: payload.phoneNumber,
                profileImage: this.defaultProfileImage,
                profileImageUrl: payload.profileImageUrl
            });

            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new UserCreationException();
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
        const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

        if (!allowedMimeTypes.includes(file.mimetype) ||
            !allowedExtensions.some(ext => file.originalname.endsWith(ext))) {
            throw new InvalidFileTypeException();
        }

        user.profileImage = Buffer.from(file.buffer);

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    async findOne(userId: string): Promise<User> {
        return this.userRepository.findOne({ where: { idUser: userId }, relations: ['wallets', 'wallets.assets'] });
    }

}