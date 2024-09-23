import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'; // Importation du type SMTPTransport


@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT), // Assurez-vous que le port est un nombre
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        } as SMTPTransport.Options); // Forçage du type pour un transport SMTP
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `https://localhost:4200/reset-password?token=${token}`;

        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`
        };

        await this.transporter.sendMail(mailOptions);
    }
}
