import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Credential} from "@feature/security/data";

@Entity('reset_token')
export class ResetToken {
    @PrimaryColumn('varchar', { length: 26 })
    reset_token_id: string;

    @Column({ nullable: false })
    token: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    used: boolean;

    @ManyToOne(() => Credential)
    @JoinColumn({ name: 'credential_id' })
    credential: Credential;

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }
}