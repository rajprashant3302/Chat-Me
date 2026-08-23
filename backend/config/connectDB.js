const mongoose = require('mongoose')

async function connectDB() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL environment variable is missing.");
        }
        await mongoose.connect(process.env.MONGODB_URL)
        
        // Listen once to prevent duplicate listeners
        if (mongoose.connection.listenerCount('error') === 0) {
            mongoose.connection.on('error', (error) => {
                console.error("MongoDB runtime connection error:", error)
            })
        }
    } catch (error) {
        console.error("Database connection failed:", error)
        throw error // Rethrow to let startup process handle failure
    }
}

module.exports = connectDB