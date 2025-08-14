import { JwtPayload } from "jsonwebtoken"
import { iDriver } from "./driver.interface"
import { User } from "../user/user.model"
import AppError from "../../ErrorHelpers/AppError"
import { Driver } from "./driver.model"
import { Role } from "../user/user.interface"


const createDriver = async(payload: iDriver, decodedToken:JwtPayload)=>{

    const { vehicleNumber, license} = payload

    const rider = await User.findById(decodedToken.userId)

    if(!rider){
        throw new AppError(401,"rider not found.please register first")
    }

   
 

    if(!vehicleNumber && !license){
        throw new AppError(401,"cannot request without valid vehicle number and license documents")
    }

    const existingDriver = await Driver.findOne({user: rider._id})

    if(existingDriver){
        throw new AppError(401,"you're already a driver")
    }


     await User.findByIdAndUpdate(rider._id, {role: Role.DRIVER}, {new: true, runValidators: true})


    const driver = await Driver.create({
        user: rider._id,
        vehicleNumber,
        license,
        totalEarning: 0,
        currentRide: null
    })

    const populatedDriver = await Driver.findById(driver._id).populate("user", "name email phone profile role" );


    return populatedDriver




    

}
const approvedDriver = async()=>{

}
const allDriver = async()=>{

}
const acceptedRide = async()=>{

}
const setAvailablity = async()=>{

}
const updateRideStatus = async()=>{

}
const viewEarnignHistory = async()=>{

}


export const driverService = {createDriver,acceptedRide, setAvailablity,updateRideStatus,viewEarnignHistory,allDriver,approvedDriver}