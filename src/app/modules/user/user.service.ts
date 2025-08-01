import AppError from "../../ErrorHelpers/AppError"
import { iAuths, iUser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/envVars"

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

const getSingleUser = async ()=>{

}

const updateUser = async (userId: string)=>{


}

export const userService = {createUser,getAllUser,getSingleUser,updateUser}