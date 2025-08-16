import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"

import { User } from "../user/user.model"
import AppError from "../../ErrorHelpers/AppError"

const OTP_EXPIRED = 2 * 60  // 120 second or 2 mint


const generateOtp = (length = 6)=>{

    const otp = crypto.randomInt(10**(length -1) , 10**length).toString()  // 10 ** means 10 to the power.  100000 - 999999 -> 6 digit

    return otp

}

const sendOTP = async (email: string, name: string)=>{

    const user = await User.findOne({email})

    if(!user){
        throw new AppError(401, "user not found")
    }

    if(user.isVerified){
        throw new AppError(401, "user is verified")
    }


    const otp = generateOtp()
    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration:{
            type: "EX",
            value: OTP_EXPIRED
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        },

    })
}
const verifyOTP = async (email: string, otp: string)=>{

    const user = await User.findOne({email})

    if(!user){
        throw new AppError(401, "user not found")
    }

    if(user.isVerified){
        throw new AppError(401, "user is verified")
    }

    const redisKey = `otp:${email}`

    const verifiedOtp = await redisClient.get(redisKey)

    if(!verifiedOtp){
        throw new AppError(401, "otp is not found")
    }

    if( verifiedOtp !== otp){
        throw new AppError(401, "otp is not matched")
    }

    // await User.updateOne({email}, {isVerified :true}, {runValidators: true})

    // await redisClient.del(redisKey)

    // transaction rollback er jnne evbeo korte pari j

    await Promise.all([
        User.updateOne({email}, {isVerified :true}, {runValidators: true}),
        redisClient.del(redisKey)
    ])
}


export const otpService = {sendOTP,verifyOTP}