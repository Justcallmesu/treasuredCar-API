// NPM Modules
const jwt = require("jsonwebtoken");

async function sendToken(req, res, email, data) {
    const refreshToken = await jwt.sign({ email }, process.env.JWTRefreshTokenSecretKey,
        {
            expiresIn: process.env.JWTUserRefreshTokenAge,
        })
    const token = await jwt.sign({ email }, process.env.JWTTokenSecretKey,
        {
            expiresIn: process.env.JWTUserTokenAge
        }
    )

    return res.cookie("userRefreshToken", refreshToken, {
        maxAge: process.env.userRefreshCookieMaxAge,
        httpOnly: true
    })
        .cookie("userToken", token, {
            maxAge: process.env.userTokenCookieMaxAge,
            httpOnly: true
        }).status(data.statusCode).json(data);
}

module.exports = sendToken;