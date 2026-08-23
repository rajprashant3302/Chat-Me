const UserModel = require("../models/UserModel")
const crypto = require("crypto")
const sendEmail = require("../helpers/sendEmail")

async function forgotPassword(request, response) {
    try {
        const { email } = request.body

        if (!email) {
            return response.status(400).json({
                message: "Email is required.",
                error: true
            })
        }

        const user = await UserModel.findOne({ email })
        
        // Return generic success to prevent email discovery attacks, but execute logic if user exists
        if (user) {
            const resetToken = crypto.randomBytes(32).toString("hex")
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

            user.forgot_password_token = hashedToken
            user.forgot_password_expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
            await user.save()

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
            const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

            // Log link for development debugging
            console.log("\n================ PASSWORD RESET LINK ================")
            console.log(`User: ${email}`)
            console.log(`Link: ${resetUrl}`)
            console.log("=====================================================\n")

            // Send actual email via helper
            await sendEmail({
                to: email,
                subject: "Reset Your Password - ChatMe",
                text: `Hi ${user.name},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 1 hour.\n\nBest regards,\nChatMe Team`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                         <h2>Password Reset Request</h2>
                         <p>Hi <b>${user.name}</b>,</p>
                         <p>You requested to reset your password. Please click the link below to set a new password:</p>
                         <p><a href="${resetUrl}" style="background-color: #00acb4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                         <p>This link is valid for 1 hour. If you didn't request this, you can ignore this email.</p>
                         <p>Best regards,<br>ChatMe Team</p>
                       </div>`
            });
        }

        return response.status(200).json({
            message: "If the email exists in our system, a password reset link has been sent.",
            success: true
        })

    } catch (error) {
        console.error("Error in forgot-password:", error)
        return response.status(500).json({
            message: "Internal server error.",
            error: true
        })
    }
}

module.exports = forgotPassword
