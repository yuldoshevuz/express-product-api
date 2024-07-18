import dotenv from "dotenv"
dotenv.config()

const {
    PORT,
    JWT_SECRET,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} = process.env

const environments = {
    PORT: +PORT || 5000,
    JWT_SECRET,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
}

export default environments