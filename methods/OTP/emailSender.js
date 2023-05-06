const nodemailer = require("nodemailer");

async function sendEmail(options) {
    const {
        email,
        subject,
        message,
        html
    } = options;

    // Create transporter for transporting / sending emails
    // MAIL TRAP
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.GMAILPASSWORD
        }
    });

    const mailOptions = {
        from: "",
        to: email,
        subject,
        text: message,
        // html
    };

    const status = await transporter.sendMail(mailOptions);
    console.log(status);
}

module.exports = sendEmail;