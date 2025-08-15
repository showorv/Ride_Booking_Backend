import { JwtPayload } from "jsonwebtoken"
import { activeStatus, iDriver } from "./driver.interface"
import { User } from "../user/user.model"
import AppError from "../../ErrorHelpers/AppError"
import { Driver } from "./driver.model"
import { Role } from "../user/user.interface"
import { Ride } from "../ride/ride.model"
import { rideStatus } from "../ride/ride.interface"


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
const approvedDriver = async(driverId: string, payload: Partial<iDriver>)=>{

    const driver = await Driver.findById(driverId)

    if(!driver){
        throw new AppError(401,"Driver not found")
    }

    const updateDriver = await Driver.findByIdAndUpdate(driverId, {isApproved: true}, {new: true, runValidators: true})

    return updateDriver




}
const suspenseDriver = async(driverId: string, payload: Partial<iDriver>)=>{

    const driver = await Driver.findById(driverId)

    if(!driver){
        throw new AppError(401,"Driver not found")
    }

    const updateDriver = await Driver.findByIdAndUpdate(driverId, {isSuspend: true, isApproved: false}, {new: true, runValidators: true})

    return updateDriver




}
const allDriver = async()=>{

    const drivers = await Driver.find();
    return drivers
}


const acceptedRide = async(rideId: string, decodedToken: JwtPayload)=>{


    const user = await User.findById(decodedToken.userId) 

      if(!user){
        throw new AppError(401,"user not found")
    }
    if(user.role !== Role.DRIVER){
        throw new AppError(401,"Only driver can accept ride")
    }

    const driver = await Driver.findOne({user: user._id})

    

    if(!driver || !driver.isApproved ){
        throw new AppError(401,"cannot accept ride you're not a driver or not approved yet")
    }

    if( driver.isSuspend){
        throw new AppError(401,"you cannot accept ride. you're suspend")
    }

    if( !driver.isAvailable){
        throw new AppError(401,"you're already in ride")
    }
    if( driver.onlineStatus === activeStatus.OFFLINE){
        throw new AppError(401,"you're in offline mode. you've to online to accept ride")
    }



    const ride = await Ride.findById(rideId)

    if(!ride){
        throw new AppError(401,"ride not found")
    }

   const acceptedRide = await Ride.findByIdAndUpdate(
        rideId,
        { driver : driver._id, 
          status: rideStatus.ACCEPTED,
         "timeStamps.acceptedAt": new Date()
        },
        {
            new:true,
            runValidators: true
        }
        )

        if(!acceptedRide){
            throw new AppError(401,"ride not accepted or already others accept it")
        }

     await Driver.findByIdAndUpdate(driver._id, {isAvailable: false, currentRide: rideId})

     return acceptedRide
}
const cancledRideByDriver = async(rideId: string, decodedToken: JwtPayload)=>{


    const user = await User.findById(decodedToken.userId) 

      if(!user){
        throw new AppError(401,"user not found")
    }
    if(user.role !== Role.DRIVER){
        throw new AppError(401,"Only driver can cancle accepted ride")
    }

    const driver = await Driver.findOne({user: user._id})

    if(!driver){
        throw new AppError(401,"user not found")
    }




    const ride = await Ride.findById(rideId)

    if(!ride){
        throw new AppError(401,"ride not found")
    }

    if(ride.driver?.toString() !== driver._id.toString()){
        throw new AppError(401,"you cannot cancle this ride. ")
    }

   const canledRideByDriver = await Ride.findByIdAndUpdate(
        rideId,
        { driver : null, 
          status: rideStatus.ACCEPTED,
         "timeStamps.acceptedAt": new Date()
        },
        {
            new:true,
            runValidators: true
        }
        )

        if(!canledRideByDriver){
            throw new AppError(401,"ride not accepted or already others accept it")
        }

     await Driver.findByIdAndUpdate(driver._id, {isAvailable: false, currentRide: rideId})

     return canledRideByDriver
}
const setAvailablity = async()=>{

}
const updateRideStatus = async()=>{

}

const getAvaiblableRidesForDriver = async() =>{

}
const viewEarnignHistory = async()=>{

}


export const driverService = {createDriver,acceptedRide, setAvailablity,updateRideStatus,viewEarnignHistory,allDriver,approvedDriver,suspenseDriver,getAvaiblableRidesForDriver,cancledRideByDriver}