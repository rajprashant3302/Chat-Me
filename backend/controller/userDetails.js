const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
    try {
        const tokenFromCookie = request.cookies.token;
        const tokenFromHeader = request.headers.authorization?.split(' ')[1];

        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return response.status(401).json({
                message: "Unauthorized: No token provided",
                logout: true
            });
        }

        const user = await getUserDetailsFromToken(token);

        // Recreate cookie automatically if it was missing but token was valid
        if (!tokenFromCookie) {
            response.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }

        return response.status(200).json({
            message: "user-details",
            data: user
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            logout: true
        });
    }
}

module.exports = userDetails;
