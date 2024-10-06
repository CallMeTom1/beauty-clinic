import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { ProductCategory } from "../../../product-category/data/model/product-category.entity";

@Entity()
export class Product {
    @PrimaryColumn('varchar', { length: 26 })
    product_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { nullable: false })
    description: string;

    @Column('decimal', { nullable: false })
    price: number;

    @Column('int', { nullable: false })
    quantity_stored: number;

    @Column({ type: 'bytea', nullable: true })
    product_image: Buffer;

    @Column('decimal', { nullable: true })
    promo_percentage: number;

    @ManyToMany(() => ProductCategory, productCategory => productCategory.products)
    @JoinTable()
    categories: ProductCategory[];
}
