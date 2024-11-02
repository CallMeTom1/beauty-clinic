import {Care} from "@feature/care/data";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {CareCategoryEntity} from "../../../care-category/data/entity/care-category.entity";

@Entity()
export class CareSubCategoryEntity {
    @PrimaryColumn('varchar', { length: 26 })
    sub_category_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @ManyToMany(() => Care, care => care.subCategories, { nullable: true })
    cares: Care[];
}