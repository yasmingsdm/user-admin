require('dotenv').config()

const dev={
    port: process.env.PORT,
    url: process.env.DB_URL
}

module.exports = dev