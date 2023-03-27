// NPM Modules
const jwt = require("jsonwebtoken");

async function sendToken(req, res, email, data, role = "user") {

    const { refreshSecretKey, tokenSecretKey, refreshExpires, tokenExpires, refreshCookieAge, tokenCookieAge } = role === "user" ? {
        refreshSecretKey: process.env.UserJWTRefreshTokenSecretKey,
        tokenSecretKey: process.env.UserJWTTokenSecretKey,
        refreshExpires: process.env.JWTUserRefreshTokenAge,
        tokenExpires: process.env.JWTUserTokenAge,
        refreshCookieAge: process.env.UserRefreshCookieMaxAge,
        tokenCookieAge: process.env.UserTokenCookieMaxAge
    } :
        {
            refreshSecretKey: process.env.SellerJWTRefreshTokenSecretKey,
            tokenSecretKey: process.env.SellerJWTTokenSecretKey,
            refreshExpires: process.env.JWTSellerRefreshTokenAge,
            tokenExpires: process.env.JWTSellerTokenAge,
            refreshCookieAge: process.env.SellerRefreshCookieMaxAge,
            tokenCookieAge: process.env.SellerTokenCookieMaxAge
        }

    const refreshToken = await jwt.sign({ email }, refreshSecretKey,
        {
            expiresIn: refreshExpires
        });

    const token = await jwt.sign({ email }, tokenSecretKey,
        {
            expiresIn: tokenExpires
        });

    return res.cookie(`${role}RefreshToken`, refreshToken,
        {
            maxAge: refreshCookieAge,
            httpOnly: true,
            sameSite: false
        })
        .cookie(`${role}Token`, token, {
            httpOnly: true,
            sameSite: false
        })
        .status(data.statusCode).json(data);
}

module.exports = sendToken;