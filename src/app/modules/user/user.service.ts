import AppError from "../../ErrorHelpers/AppError"
import { Role, iAuths, iUser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/envVars"
import { JwtPayload } from "jsonwebtoken"
import { cloudinaryDeleteUpload } from "../../config/cloudinary.config"

const createUser =async (payload: Partial<iUser>)=>{

    const {email, password,...rest} = payload

    const userExist = await User.findOne({email})

    if(userExist){
        throw new AppError(httpStatus.FORBIDDEN, "email already exist")
    }

    const authsProvider: iAuths = {
        provider: "credientials",
        providerId: email as string
    } 

    const hashpassword = await bcrypt.hash(password as string, Number(envVars.HASH_SALT))

    const user = await User.create({
        email, 
        password: hashpassword,
        auths: authsProvider,
        ...rest
    })

    return user

}

const getAllUser = async ()=>{

    const allUser = await User.find();

    const totalUser = await User.countDocuments() 

    return {
        user: allUser,
        meta: {
            total:  totalUser
        }
    }
}

const getSingleUser = async (userId: string)=>{

    const user = await User.findById(userId).select("-password");

    return user

}

const updateUser = async(userId: string, payload: Partial<iUser>, decodeToken: JwtPayload)=>{

    if(decodeToken.role===Role.RIDER|| decodeToken.role === Role.DRIVER){
        if(userId !== decodeToken.userId){
            throw new AppError(httpStatus.FORBIDDEN, "you cannot update this")
        }
    }
  
    const findUser = await User.findById(userId)

    if(!findUser){
        throw new AppError(httpStatus.NOT_FOUND, "user not found")
    }

    if(decodeToken.role === Role.ADMIN && findUser.role===Role.SUPERADMIN){
        throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
    }

    if(payload.role){
        if(decodeToken.role === Role.RIDER || decodeToken.role === Role.DRIVER){
            throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        }

        // if(payload.role === Role.SUPERADMIN || decodeToken.role === Role.ADMIN){
        //     throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        // }
    }

    if(  payload.isBlocked){
        if(decodeToken.role === Role.RIDER || decodeToken.role === Role.DRIVER){
            throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        }
    }

    // if(payload.password){
    //     payload.password = await bcrypt.hash(payload.password,Number( envVars.HASH_SALT))
    // }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

    if(payload.profile && findUser.profile){
        await cloudinaryDeleteUpload(findUser.profile);
    }

    return newUpdateUser;
    

}

const getMe = async(userId: string)=>{

    const user = await User.findById(userId).select("-password")

    return user;



   
}




export const userService = 
{
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    getMe
}