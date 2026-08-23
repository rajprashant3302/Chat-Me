
const UserModel = require('../models/UserModel')

async function searchUser(request, response) {
    try {
        const { search } = request.body

        // Escape regex special characters to prevent crashes
        const escapedSearch = (search || "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const query = new RegExp(escapedSearch, "i")

        const user = await UserModel.find({
            "$or": [
                { "name": query },
                { "email": query }
            ]
        }).select("-password")

        return response.json({
            message: "all user",
            data: user,
            success: true
        })
     } catch (error) {
        return response.status(500).json({
            message : error.message || "error",
            error : true
        })
    }

}

module.exports =searchUser