import dotenv from "dotenv"

dotenv.config()


export const envVars = {
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    NODE_DEV: process.env.NODE_DEV,
    HASH_SALT: process.env.HASH_SALT,
    FRONTEND_URL:process.env.FRONTEND_URL,
    JWT_ACCESTOKEN_SECRET: process.env.JWT_ACCESTOKEN_SECRET,
    JWT_ACCESTOKEN_EXPIRED: process.env.JWT_ACCESTOKEN_EXPIRED,
    JWT_REFRESHTOKEN_SECRET: process.env.JWT_REFRESHTOKEN_SECRET,
    JWT_REFRESHTOKEN_EXPIRED: process.env.JWT_REFRESHTOKEN_EXPIRED,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD,

    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
        CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY
    },

    NODEMAILER:{
        SMTP_HOST:process.env.SMTP_HOST,
        SMTP_PORT:process.env.SMTP_PORT,
        SMTP_PASS:process.env.SMTP_PASS,
        SMTP_USER:process.env.SMTP_USER,
        SMTP_FROM:process.env.SMTP_FROM,
   
    },

    REDIS:{
        
    REDIS_USERNAME:process.env.REDIS_USERNAME,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT
    }
}

