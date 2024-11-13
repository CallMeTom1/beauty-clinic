import {BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "@feature/user/model/entity/user.entity";
import {ulid} from "ulid";
import {UserCreationException} from "@feature/user/exception/user.exception";
import {CreateUserInterface} from "@feature/user/model/payload/create-user.interface";
import {
    UserNotFoundException
} from "@feature/security/security.exception";
import {ModifyUserPayload} from "@feature/user/model/payload/modify-user.payload";
import {Cart} from "../cart/data/model/cart.entity";
import {Address} from "@common/model/address.entity";
import {ModifyAddressPayload} from "@feature/user/model/payload/modify-address.payload";
import {AddAddressPayload} from "@feature/user/model/payload/add-address.payload";
import {Wishlist} from "../wish-list/data/model/wishlist.entity";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        @InjectRepository(Wishlist) private readonly wishlistRepository: Repository<Wishlist>,
    ) {}

    async createUser(payload: CreateUserInterface): Promise<User> {
        const idUser: string = ulid();
        try {
            this.logger.log('Creating a new user...');

            const newUser: User = this.userRepository.create({
                idUser,
                firstname: payload.firstname,
                lastname: payload.lastname,
                phoneNumber: payload.phoneNumber,
                email: payload.email,
                addresses: []
            });

            const user: User = await this.userRepository.save(newUser);
            this.logger.log('User created successfully with ID:', idUser);

            const cart: Cart = await this.cartRepository.save(
                this.cartRepository.create({
                    idCart: ulid(),
                    user: user
                })
            );
            this.logger.log('Cart created successfully for user with ID:', idUser);

            // Create and save wishlist
            const wishlist: Wishlist = await this.wishlistRepository.save(
                this.wishlistRepository.create({
                    wishlist_id: ulid(),
                    user: user,
                    products: [],
                    cares: []
                })
            );
            this.logger.log('Wishlist created successfully for user with ID:', idUser);


            user.cart = cart;
            user.wishlist = wishlist
            return await this.userRepository.save(user);



        } catch (error) {
            this.logger.error('Error occurred while creating user:', error);
            throw error instanceof UserCreationException ? error : new BadRequestException('An error occurred while creating the user.');
        }
    }

    async findUserById(idUser: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { idUser },
            relations: ['addresses', 'cart', 'orders', 'wishlist'],
        });

        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    async modifyUser(userId: string, payload: ModifyUserPayload): Promise<User> {
        const user: User = await this.findUserById(userId);

        if (payload.firstname) user.firstname = payload.firstname;
        if (payload.lastname) user.lastname = payload.lastname;
        if (payload.phonenumber) user.phoneNumber = payload.phonenumber;
        if (payload.username) user.username = payload.username;
        console.log(user)
        return this.userRepository.save(user);
    }

    async addAddress(userId: string, payload: AddAddressPayload): Promise<Address> {
        const user = await this.findUserById(userId);

        const newAddress = this.addressRepository.create({
            address_id: ulid(),
            ...payload
        });

        if (payload.isDefault) {
            if (payload.isShippingAddress) {
                await this.resetDefaultAddresses(user.addresses, true, false);
            }
            if (payload.isBillingAddress) {
                await this.resetDefaultAddresses(user.addresses, false, true);
            }
        }

        const savedAddress = await this.addressRepository.save(newAddress);
        user.addresses = [...user.addresses, savedAddress];
        await this.userRepository.save(user);

        return savedAddress;
    }

    async modifyAddress(userId: string, payload: ModifyAddressPayload): Promise<Address> {
        const user = await this.findUserById(userId);
        const address = user.addresses.find(addr => addr.address_id === payload.addressId);

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        const { addressId, ...addressData } = payload;

        if (payload.isDefault) {
            if (payload.isShippingAddress) {
                await this.resetDefaultAddresses(user.addresses, true, false, addressId);
            }
            if (payload.isBillingAddress) {
                await this.resetDefaultAddresses(user.addresses, false, true, addressId);
            }
        }

        const updatedAddress = {
            ...address,
            ...addressData
        };

        return this.addressRepository.save(updatedAddress);
    }

    async deleteAddress(userId: string, addressId: string): Promise<void> {
        const user = await this.findUserById(userId);
        const address = user.addresses.find(addr => addr.address_id === addressId);

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        user.addresses = user.addresses.filter(addr => addr.address_id !== addressId);
        await this.userRepository.save(user);
        await this.addressRepository.remove(address);
    }

    private async resetDefaultAddresses(
        addresses: Address[],
        isShipping: boolean,
        isBilling: boolean,
        excludeId?: string
    ): Promise<void> {
        const addressesToUpdate = addresses.filter(addr =>
            ((isShipping && addr.isShippingAddress) || (isBilling && addr.isBillingAddress)) &&
            addr.isDefault &&
            addr.address_id !== excludeId
        );

        if (addressesToUpdate.length > 0) {
            await Promise.all(
                addressesToUpdate.map(addr => {
                    addr.isDefault = false;
                    return this.addressRepository.save(addr);
                })
            );
        }
    }
}