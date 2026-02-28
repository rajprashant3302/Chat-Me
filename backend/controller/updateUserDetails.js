const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || ""
        const user = await getUserDetailsFromToken(token)

        const { name, profile_pic,_id } = request.body
        if (!name && !profile_pic) {
            return response.status(400).json({
                message: "Name and profile_pic are required.",
                success: false
            });
        }


        const updateUser = await UserModel.updateOne({ _id: _id }, {
            name,
            profile_pic
        })
       

        const userInformation = await UserModel.findById(_id)
        return response.status(200).json({
            message: "User Updated Successfully",
            data: userInformation,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = updateUserDetails