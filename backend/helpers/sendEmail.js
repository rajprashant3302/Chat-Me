const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text, html }) {
    // If credentials are not provided, log email to console and succeed gracefully
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("\n================ MOCK EMAIL SENT ================");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Text: ${text}`);
        console.log("=================================================\n");
        return { message: "Mock email logged to console", success: true };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"ChatMe Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        // Do not crash the application if email sending fails
        return { success: false, error: error.message };
    }
}

module.exports = sendEmail;
