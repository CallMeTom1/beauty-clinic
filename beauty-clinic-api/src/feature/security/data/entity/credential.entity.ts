import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Exclude} from "class-transformer";
import { Role } from '../role.enum';
import {User} from "@feature/user/model/entity/user.entity";

@Entity()
export class Credential {

    @PrimaryColumn('varchar', { length:26})
    credential_id: string;

    @Exclude({ toPlainOnly: true })
    @Column({nullable: true})
    password: string;

    @Column({nullable: true, unique: true})
    mail: string;

    @Column({ nullable: true, unique: true })
    googleHash: string;

    @Column({ nullable: true, unique: true })
    facebookHash: string;

    @Column({default: true})
    active: boolean;

    @Column({length: 25, nullable: false, default: Role.USER})
    role: Role;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ nullable: true, type: 'timestamp' })
    resetTokenExpiresAt: Date;

}