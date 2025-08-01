import dotenv from "dotenv"

dotenv.config()


export const envVars = {
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    NODE_DEV: process.env.NODE_DEV,
    HASH_SALT: process.env.HASH_SALT
}

