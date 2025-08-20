import AppError from "../../ErrorHelpers/AppError"
import { iUser } from "../user/user.interface"
import { User } from "../user/user.model"

import bcrypt from "bcryptjs"
import { createUserToken } from "../../utils/generateToken"
import { generateToken, verifiedToken } from "../../utils/jwtToken"
import { envVars } from "../../config/envVars"
import { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"

const login = async (payload: iUser)=>{

    const {email, password} = payload

    const userExist = await User.findOne({email})

    if(!userExist){
        throw new AppError (httpStatus.NOT_FOUND, "email not correct")
    }
    if(!userExist.isVerified){
        throw new AppError (httpStatus.NOT_FOUND, "you are not verified")
    }

    const isPasswordMatch = await bcrypt.compare(password as string, userExist.password as string)

    if(!isPasswordMatch){
        throw new AppError (httpStatus.NOT_FOUND, "password is incorrect")
    }

    const userTokens = createUserToken(userExist)

    const {password: pass, ...rest} = userExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }


}

const generateNewAccessToken = async(refreshToken: string)=>{

    const verifiedRefreshToken = verifiedToken(refreshToken, envVars.JWT_REFRESHTOKEN_SECRET as string) as JwtPayload;

    const userExist = await User.findOne({email: verifiedRefreshToken.email})

    if(!userExist){
        throw new AppError(httpStatus.BAD_REQUEST, "user not exist")
    }

   
    if(userExist.isBlocked){
        throw new AppError(httpStatus.BAD_REQUEST, "user is blocked")
    }

    const jsonPayload = {
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    }
    const accessToken = generateToken(jsonPayload, envVars.JWT_ACCESTOKEN_SECRET as string, envVars.JWT_ACCESTOKEN_EXPIRED as string)


    return {
        accessToken,
   
    }
}

const changePassword =async (oldPassword: string, newPassword: string, decodedToken: JwtPayload)=>{

    // check old password  get old password from verifiedtoken. hash the newpassword and save in user

    const user = await User.findById(decodedToken.userId);
      
    if(!user){
        throw new AppError(httpStatus.FORBIDDEN, "user not found")
    }

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password as string);

    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.FORBIDDEN, "old password is incorrect")
    }

    user.password = await bcrypt.hash(newPassword, Number(envVars.HASH_SALT))

    user.save();

}

const forgotPassword =async (email: string)=>{

    const userExist = await User.findOne({email})
 
         if(!userExist){
             throw new AppError(httpStatus.BAD_REQUEST, "user not exist")
         }
 
       
         if(userExist.isBlocked){
             throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
         }
         if(!userExist.isVerified){
         throw new AppError(httpStatus.BAD_REQUEST, "user is not verified")
         }
        
         
         const JwtPayload = {
             userId: userExist._id,
             email: userExist.email,
             role: userExist.role
         }
 
         const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESTOKEN_SECRET as string , {
             expiresIn: "10m"
         })
 
         const forgotUILink = `${envVars.FRONTEND_URL}/reset-password?id=${userExist._id}&token=${resetToken}`
    
 
       await  sendEmail({
             to: userExist.email,
             subject: "Reset Password ",
             templateName: "sendEmail",
             templateData: {
                 name: userExist.name,
                 reseturl: forgotUILink,
             }
         })

         console.log("name,resetulr", forgotUILink)
         
 
 }
const resetPassword =async (payload: Record<string,any>, decodedToken: JwtPayload)=>{

    if(payload.id !== decodedToken.userId){
        throw new AppError(401, "you cannot change password")
    }


    const user = await User.findById(decodedToken.userId)
    
    

    if(!user){
        throw new AppError(401, "user not found")
    }

    const hashPassword = await bcrypt.hash(payload.password, Number(envVars.HASH_SALT))

    user.password = hashPassword

    await user.save()


}

export const authService = 
{
    login, 
    generateNewAccessToken,
    resetPassword,
    changePassword,
    forgotPassword
}