import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Message } from './Messages.js';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const SMTP_VERIFY_ON_STARTUP = String(process.env.SMTP_VERIFY_ON_STARTUP || 'false').toLowerCase() === 'true';

// const transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: 465,
//     secure: true,
//     family: 4,
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//     auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS
//     },
// });

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    family: 4,

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,

    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },

    tls: {
        rejectUnauthorized: false,
    },
});

if (SMTP_VERIFY_ON_STARTUP) {
    transporter.verify((error) => {
        if (error) {
            console.error("❌ SMTP Connection Error:", error);
        } else {
            console.log("✅ SMTP Server Ready");
        }
    });
}

export const sendEmail = async (emailOptions) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
    };
    try {
        await transporter.sendMail(mailOptions);
        // console.log(`Email sent to: ${emailOptions.to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(Message.errorToSendingEmail);
    };
};
