const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    console.error("Error: MONGODB_URL is not defined in your environment variables.");
    process.exit(1);
}

async function clearDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected successfully.");

        // Fetch collections dynamically to delete them safely
        const collections = mongoose.connection.collections;
        
        console.log("\nClearing collections:");
        for (const key in collections) {
            console.log(` - Clearing collection: ${key}...`);
            await collections[key].deleteMany({});
        }

        console.log("\nDatabase cleared successfully! All users, conversations, and messages have been deleted.");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

clearDatabase();
