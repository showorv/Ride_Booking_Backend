import dotenv from "dotenv"

dotenv.config()


export const envVars = {
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    NODE_DEV: process.env.NODE_DEV,
    HASH_SALT: process.env.HASH_SALT,
    JWT_ACCESTOKEN_SECRET: process.env.JWT_ACCESTOKEN_SECRET,
    JWT_ACCESTOKEN_EXPIRED: process.env.JWT_ACCESTOKEN_EXPIRED,
    JWT_REFRESHTOKEN_SECRET: process.env.JWT_REFRESHTOKEN_SECRET,
    JWT_REFRESHTOKEN_EXPIRED: process.env.JWT_REFRESHTOKEN_EXPIRED
}

