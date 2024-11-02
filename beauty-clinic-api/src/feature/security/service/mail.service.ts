import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // Utilisez TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                // Ne pas rejeter les certificats non autorisés
                rejectUnauthorized: false
            }
        } as SMTPTransport.Options);
    }

    async sendPasswordResetEmail(to: string, resetLink: string) {
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
