const UserModel = require('../models/UserModel')
const bcryptjs = require('bcryptjs')
const sendEmail = require('../helpers/sendEmail')

async function registerUser(request, response) {
    try {
        const { name, email, password, profile_pic } = request.body

        if (profile_pic && profile_pic.startsWith('blob:')) {
            return response.status(400).json({
                message: "Invalid profile picture format.",
                error: true
            });
        }

        const checkEmail = await UserModel.findOne({ email })

        if (checkEmail) {
            return response.status(400).json({
                message: "Email Exists Already",
                error: true,
            })
        }

        // password into hashpassword

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt)


        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword
        }

        const user = new UserModel(payload)
        const userSave = await user.save()

        // Send Welcome Email
        await sendEmail({
            to: email,
            subject: "Welcome to ChatMe!",
            text: `Hi ${name},\n\nYour account has been successfully created on ChatMe. Welcome aboard!\n\nBest regards,\nChatMe Team`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                     <h2>Welcome to ChatMe!</h2>
                     <p>Hi <b>${name}</b>,</p>
                     <p>Your account has been successfully created. You can now log in and start chatting!</p>
                     <p>Best regards,<br>ChatMe Team</p>
                   </div>`
        });

        return response.status(201).json({
            message: "User Created Successfully !",
            data: userSave,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
        })
    }
}

module.exports = registerUser