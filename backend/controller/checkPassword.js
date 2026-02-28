const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request, response) {
    try {
        const { password, _id } = request.body

        const user = await UserModel.findOne({ _id })
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true
            });
        }

        
        const verifyPassword = await bcryptjs.compare(password, user.password)

        if (!verifyPassword)
            return response.status(400).json({
                message: "Wrong Password",
                error: true
            })
        const tokendata = {
            id: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokendata, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        const cookieOption = {
            http: true,
            secure: true
        }

        return response.cookie('token', token, cookieOption).status(200).json({
            message: "Login Success",
            sucess: true,
            token: token
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}


module.exports = checkPassword