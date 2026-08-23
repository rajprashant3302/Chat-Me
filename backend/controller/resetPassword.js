const UserModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")
const sendEmail = require("../helpers/sendEmail")

async function resetPassword(request, response) {
    try {
        const { token, password } = request.body

        if (!token || !password) {
            return response.status(400).json({
                message: "Token and password are required.",
                error: true
            })
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await UserModel.findOne({
            forgot_password_token: hashedToken,
            forgot_password_expiry: { $gt: new Date() }
        })

        if (!user) {
            return response.status(400).json({
                message: "Invalid or expired reset token.",
                error: true
            })
        }

        // Salt and hash new password
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt)

        // Update user password and clear token fields
        user.password = hashpassword
        user.forgot_password_token = ""
        user.forgot_password_expiry = null
        await user.save()

        // Send Reset Confirmation Email
        try {
            await sendEmail({
                to: user.email,
                subject: "Your password was successfully reset - ChatMe",
                text: `Hi ${user.name},\n\nThis is a confirmation email that the password for your ChatMe account was successfully updated.\n\nIf you did not make this change, please contact support immediately.\n\nBest regards,\nChatMe Team`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                         <h2>Password Updated Successfully</h2>
                         <p>Hi <b>${user.name}</b>,</p>
                         <p>This is a confirmation email that your password for ChatMe has been successfully reset.</p>
                         <p>If you did not perform this change, please contact support immediately.</p>
                         <p>Best regards,<br>ChatMe Team</p>
                       </div>`
            });
        } catch (emailError) {
            console.error("Failed to send reset confirmation email:", emailError);
        }

        return response.status(200).json({
            message: "Password reset successfully.",
            success: true
        })

    } catch (error) {
        console.error("Error in reset-password:", error)
        return response.status(500).json({
            message: "Internal server error.",
            error: true
        })
    }
}

module.exports = resetPassword
