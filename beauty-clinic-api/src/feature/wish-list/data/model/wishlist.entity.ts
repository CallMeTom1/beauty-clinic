import {Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "@feature/user/model";
import {Product} from "../../../product/data/entity/product.entity";
import {Care} from "@feature/care/data";

@Entity()
export class Wishlist {
    @PrimaryColumn('varchar', { length: 26 })
    wishlist_id: string;

    @ManyToOne(() => User, { nullable: false })
    user: User;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'wishlist_products',
        joinColumn: {
            name: 'wishlist_id',
            referencedColumnName: 'wishlist_id'
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'product_id'
        }
    })
    products: Product[];

    @ManyToMany(() => Care)
    @JoinTable({
        name: 'wishlist_cares',
        joinColumn: {
            name: 'wishlist_id',
            referencedColumnName: 'wishlist_id'
        },
        inverseJoinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        }
    })
    cares: Care[];
}