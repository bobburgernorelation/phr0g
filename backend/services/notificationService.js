const nodemailer = require('nodemailer');

class NotificationService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async notifyApplicationStatus(userEmail, jobTitle, status) {
        const subject = `Application Update: ${jobTitle}`;
        const text = `Your application for ${jobTitle} has been updated to: ${status}`;
        await this.sendEmail(userEmail, subject, text);
    }
}

module.exports = new NotificationService(); 