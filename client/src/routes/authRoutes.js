const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const UserModel = require('../models/UserModel');

const OTP_STORE = new Map(); // or Redis for production

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        OTP_STORE.set(email, otp);
        setTimeout(() => OTP_STORE.delete(email), 5 * 60 * 1000); // expires in 5 min

        await transporter.sendMail({
            from: `"ChatMe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for ChatMe Registration",
            text: `Your OTP is: ${otp}`,
        });

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP", error });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = OTP_STORE.get(email);
    if (storedOtp === otp) {
        OTP_STORE.delete(email);
        res.json({ success: true, message: "OTP verified" });
    } else {
        res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
});

module.exports = router;
