const express = require('express')
const cors = require('cors')
const cookiesParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config()

// 1. Startup Environment Checks
const requiredEnv = ['MONGODB_URL', 'JWT_SECRET_KEY', 'FRONTEND_URL'];
requiredEnv.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`FATAL STARTUP ERROR: Required environment variable ${envVar} is missing.`);
        process.exit(1);
    }
});

const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const { app, server } = require('./socket/index')

// 2. Custom Lightweight In-Memory Rate Limiter
const ipMap = new Map();
const rateLimiter = (limit, windowMs) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const now = Date.now();
        if (!ipMap.has(ip)) {
            ipMap.set(ip, []);
        }
        const requests = ipMap.get(ip).filter(timestamp => now - timestamp < windowMs);
        if (requests.length >= limit) {
            return res.status(429).json({
                message: "Too many requests from this IP. Please try again later.",
                error: true
            });
        }
        requests.push(now);
        ipMap.set(ip, requests);
        next();
    };
};

// Periodic pruning of rate limit map to avoid memory growth/leak
setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of ipMap.entries()) {
        const filtered = requests.filter(t => now - t < 15 * 60 * 1000);
        if (filtered.length === 0) {
            ipMap.delete(ip);
        } else {
            ipMap.set(ip, filtered);
        }
    }
}, 5 * 60 * 1000).unref();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

// Apply rate limiting to critical authentication endpoints
app.use('/api/email', rateLimiter(20, 60 * 1000));
app.use('/api/password', rateLimiter(20, 60 * 1000));
app.use('/api/register', rateLimiter(15, 60 * 1000));
app.use('/api/forgot-password', rateLimiter(5, 60 * 1000));
app.use('/api/reset-password', rateLimiter(5, 60 * 1000));

app.get('/', (request, response) => {
    response.json({
        message: "server running at " + PORT
    })
})

//api endpoint 
app.use('/api', router)

// 3. Global Express Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled request-level error:", err);
    res.status(500).json({
        message: "Internal server error.",
        error: true
    });
});

// 4. Process Exception and Rejection Listeners
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception thrown:', err);
    // Keep server alive but log details
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// 5. Graceful Server Shutdown
const gracefulShutdown = () => {
    console.log("Received shutdown signal. Starting graceful shutdown...");
    server.close(() => {
        console.log("HTTP server closed.");
        mongoose.connection.close(false).then(() => {
            console.log("MongoDB connection closed.");
            process.exit(0);
        }).catch(err => {
            console.error("Error during MongoDB connection shutdown:", err);
            process.exit(1);
        });
    });

    // Enforce hard shutdown timeout
    setTimeout(() => {
        console.error("Shutdown timed out. Forcing exit.");
        process.exit(1);
    }, 10000).unref();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Connect DB and Start Server
connectDB()
.then(() => {
    console.log("MongoDB Connected Successfully");
    server.listen(PORT, () => {
        console.log("Server running at " + PORT)
    })
})
.catch((err) => {
    console.error("FATAL: Database connection failed. Exiting server.", err);
    process.exit(1);
});
