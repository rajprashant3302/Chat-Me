const express = require('express')
const cors = require('cors')
const cookiesParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router=require('./routes/index')
const {app,server} =require('./socket/index')
// 
// const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())


const PORT = process.env.PORT || 8080

app.get('/', (request, response) => {
    response.json(
        {
            message: "server running at " + PORT
        }
    )
})


//api endpoint 
app.use('/api',router)


connectDB()
.then(() => {
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
        console.log("Server running at " + PORT)
    })
})
.catch((err) => {
    console.error("Database connection failed:", err);
});
