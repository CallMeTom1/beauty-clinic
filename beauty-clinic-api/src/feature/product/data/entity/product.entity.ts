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

    @Column({ type: 'text', nullable: true }) // Utilisation de 'text' pour stocker la chaîne encodée en base64
    product_image: string;

    @Column('decimal', { nullable: true })
    promo_percentage: number;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @ManyToMany(() => ProductCategory, productCategory => productCategory.products, { nullable: true }) // Relation many-to-many avec possibilité d'absence de catégories
    @JoinTable()
    categories: ProductCategory[]; // Peut être un tableau vide ou null

}
