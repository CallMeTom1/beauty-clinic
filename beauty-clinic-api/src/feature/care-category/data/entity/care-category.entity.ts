import {Care} from "@feature/care/data";
import {Column, Entity, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {CareSubCategoryEntity} from "../../../care-sub-category/data/entity/care-sub-category.entity";

@Entity()
export class CareCategoryEntity {
    @PrimaryColumn('varchar', { length: 26 })
    category_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { nullable: true, unique: false })
    description: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @ManyToMany(() => Care, care => care.categories, { nullable: true })
    cares: Care[];

    @Column({ type: 'text', nullable: true })
    category_image: string;

    @OneToMany(() => CareSubCategoryEntity, subCategory => subCategory.category, {nullable: true})
    subCategories: CareSubCategoryEntity[];
}