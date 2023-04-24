require('dotenv').config()

const dev={
    port: process.env.PORT,
    url: process.env.DB_URL,
    jwtKey: process.env.JWT_KEY,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    clientUrl: process.env.CLIENT_URL,
    sessionKey: process.env.SESSION_KEY,
}

module.exports = dev