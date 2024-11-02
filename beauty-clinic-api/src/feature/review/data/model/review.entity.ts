import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {User} from "@feature/user/model";
import {Product} from "../../../product/data/entity/product.entity";
import {Care} from "@feature/care/data";

@Entity()
export class Review {
    @PrimaryColumn('varchar', { length: 26 })
    review_id: string;

    @Column('int', { nullable: false })
    rating: number; // Note donnée par l'utilisateur (par exemple de 1 à 5)

    @Column('varchar', { nullable: true, length: 1000 })
    comment: string; // Commentaire optionnel

    @CreateDateColumn()
    createdAt: Date; // Date de création automatique

    @UpdateDateColumn()
    updatedAt: Date; // Date de mise à jour automatique

    @ManyToOne(() => User, user => user.reviews, {
        nullable: false,
        onDelete: 'CASCADE' // Si l'utilisateur est supprimé, ses reviews sont aussi supprimées
    })
    user: User;

    @ManyToOne(() => Product, product => product.reviews, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    product: Product;

    @ManyToOne(() => Care, care => care.reviews, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    care: Care;
}