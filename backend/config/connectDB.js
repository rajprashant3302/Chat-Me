const mongoose= require('mongoose')

async function connectDB(){
    try{
        console.log(process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL)

        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log("Connect to DB")
        })

        connection.on('error',(error)=>{
            console.log("Something is wrong in MongoDB ",error)
        })
    }catch(error){
        console.log("Something is wrong ",error)
    }
}

module.exports = connectDB