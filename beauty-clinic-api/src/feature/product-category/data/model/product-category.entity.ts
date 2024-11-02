import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Product } from "../../../product/data/entity/product.entity";

@Entity()
export class ProductCategory {
    @PrimaryColumn('varchar', { length: 26 })
    product_category_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { nullable: true, unique: false })
    description: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @ManyToMany(() => Product, product => product.categories, { nullable: true })
    products: Product[];
}
