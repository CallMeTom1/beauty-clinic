import { ProductCategory } from "../../../product-category/data/model/product-category.entity";
import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {BaseEntity} from "@common/model/base-entity.entity";
import {Review} from "../../../review/data/model/review.entity";

@Entity()
export class Product extends BaseEntity{
    @PrimaryColumn('varchar', { length: 26 })
    product_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { nullable: false })
    description: string;

    @Column('decimal', { nullable: false, precision: 10, scale: 2 })
    initial_price: number;

    @Column('boolean', { default: false })
    is_promo: boolean;

    @Column('decimal', { nullable: true, precision: 5, scale: 2 })
    promo_percentage: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    price_discounted: number;

    @Column('int', { default: 1 })
    minQuantity: number; // Quantité minimum pour commander

    @Column('int', { default: 5, nullable: true })
    maxQuantity: number; // Quantité maximum par commande

    @Column('int', { nullable: false })
    quantity_stored: number;

    @Column({ type: 'text', nullable: true })
    product_image: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @ManyToMany(() => ProductCategory, productCategory => productCategory.products, { nullable: true })
    @JoinTable({
        name: 'product_categories_relation',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'product_id'
        },
        inverseJoinColumn: {
            name: 'product_category_id',
            referencedColumnName: 'product_category_id'
        }
    })
    categories: ProductCategory[];

    @OneToMany(() => Review, review => review.product)
    reviews: Review[];
}
