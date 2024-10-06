import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'; // Importation du type SMTPTransport


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


    async sendEmailVerificationEmail(to: string, verificationLink: string) {
        const mailOptions = {
            from: 'Votre Nom <no-reply@votre-domaine.com>',
            to: to,
            subject: 'Vérification de votre adresse email',
            html: `<p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
               <p><a href="${verificationLink}">Vérifier mon email</a></p>`
        };

        try{
            await this.transporter.sendMail(mailOptions);

        }
        catch (e) {
            console.error('Erreur lors de l\'envoi de l\'email :', e);
        }
    }
}
