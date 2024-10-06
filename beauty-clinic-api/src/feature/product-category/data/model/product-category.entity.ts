import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Product } from "../../../product/data/entity/product.entity";

@Entity()
export class ProductCategory {
    @PrimaryColumn('varchar', { length: 26 })
    product_category_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column({ type: 'bytea', nullable: true })
    product_category_image: Buffer;

    @ManyToMany(() => Product, product => product.categories)
    products: Product[];

}
