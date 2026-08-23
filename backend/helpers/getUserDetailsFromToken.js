const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return null;
    }
    try {
        // jwt.verify is synchronous; await is not strictly needed but wrapping it is important.
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decode || !decode.id) {
            return null;
        }
        const user = await UserModel.findById(decode.id).select('-password')
        return user;
    } catch (error) {
        console.warn("JWT verification failed:", error.message);
        return null;
    }
}

module.exports = getUserDetailsFromToken