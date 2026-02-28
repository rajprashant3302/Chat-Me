const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide Name"]
    },
    email: {
        type:String,
        required :[true,"Provide Email"],
        unique:true
    },
    password:{
        type:String,
        required :[true,"Provide Password"]

    },
    profile_pic :{
        type:String,
        default:""
    }
},{
    timestamps :true
})

const UserModel=mongoose.model('User',userSchema)

module.exports =UserModel