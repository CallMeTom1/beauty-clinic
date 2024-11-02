import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import {Exclude} from "class-transformer";
import { Role } from '../role.enum';
import {User} from "@feature/user/model/entity/user.entity";
import {ResetToken} from "@feature/security/data/entity/reset-token.entity";

@Entity('credential')
export class Credential {
    @PrimaryColumn('varchar', { length: 26 })
    credential_id: string;

    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true })
    password: string;

    @Column({ nullable: false, unique: true })
    mail: string;

    @Column({ nullable: true, unique: true })
    googleHash: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: false })
    is_validated: boolean;

    @Column({ length: 25, nullable: false, default: Role.USER })
    role: Role;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => ResetToken, (resetToken) => resetToken.credential, {
        cascade: true
    })
    resetTokens: ResetToken[];
}