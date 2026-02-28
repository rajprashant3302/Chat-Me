async function logout(request, response) {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only in production
            sameSite: "strict",
        };

        // Clear the token cookie
        response.clearCookie('token', cookieOptions);

        return response.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = logout;
