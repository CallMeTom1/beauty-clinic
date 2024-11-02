import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {BeautyCareMachine} from "@feature/care/enum";
import {CareCategoryEntity} from "../../../care-category/data/entity/care-category.entity";
import {CareSubCategoryEntity} from "../../../care-sub-category/data/entity/care-sub-category.entity";
import {BodyZoneEntity} from "../../../body-zone/data/entity/body-zone.entity";
import {CareMachine} from "../../../care-machine/data/model/care-machine.entity";
import {Review} from "../../../review/data/model/review.entity";

@Entity()
export class Care extends BaseEntity {
    @PrimaryColumn('varchar', { length: 26 })
    care_id: string;

    @Column('varchar', { nullable: false, unique: true })
    name: string;

    @Column('varchar', { length: 500, nullable: false })
    description: string;

    @Column({ type: 'text', nullable: true })
    care_image: string;

    @Column('int', { nullable: false })
    sessions: number;

    @Column('decimal', { nullable: false, precision: 10, scale: 2 })
    initial_price: number;

    @Column('boolean', { default: false })
    is_promo: boolean;

    @Column('decimal', { nullable: true, precision: 5, scale: 2 })
    promo_percentage: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    price_discounted: number;

    @Column('int', { nullable: false })
    duration: number;

    @Column('int', { nullable: true })
    time_between: number;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @Column('timestamp', { nullable: true })
    created_at: Date;

    @Column('timestamp', { nullable: true })
    updated_at: Date;

    @ManyToMany(() => CareMachine, machine => machine.cares, { nullable: true })
    @JoinTable({
        name: 'care_machines_relation',
        joinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        },
        inverseJoinColumn: {
            name: 'care_machine_id',
            referencedColumnName: 'care_machine_id'
        }
    })
    machines: CareMachine[];

    @ManyToMany(() => CareCategoryEntity, category => category.cares, { nullable: true })
    @JoinTable({
        name: 'care_categories_relation',
        joinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'category_id'
        }
    })
    categories: CareCategoryEntity[];

    @ManyToMany(() => CareSubCategoryEntity, subCategory => subCategory.cares, { nullable: true })
    @JoinTable({
        name: 'care_subcategories_relation',
        joinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        },
        inverseJoinColumn: {
            name: 'sub_category_id',
            referencedColumnName: 'sub_category_id'
        }
    })
    subCategories: CareSubCategoryEntity[];

    @ManyToMany(() => BodyZoneEntity, bodyZone => bodyZone.cares, { nullable: true })
    @JoinTable({
        name: 'care_body_zones_relation',
        joinColumn: {
            name: 'care_id',
            referencedColumnName: 'care_id'
        },
        inverseJoinColumn: {
            name: 'body_zone_id',
            referencedColumnName: 'body_zone_id'
        }
    })
    bodyZones: BodyZoneEntity[];

    @OneToMany(() => Review, review => review.care)
    reviews: Review[];
}