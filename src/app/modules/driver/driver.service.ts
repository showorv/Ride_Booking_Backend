import { JwtPayload } from "jsonwebtoken"
import { activeStatus, iDriver } from "./driver.interface"
import { User } from "../user/user.model"
import AppError from "../../ErrorHelpers/AppError"
import { Driver } from "./driver.model"
import { Role } from "../user/user.interface"
import { Ride } from "../ride/ride.model"
import { iRide, rideStatus } from "../ride/ride.interface"


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

    if (ride.status !== rideStatus.ACCEPTED) {
        throw new AppError(401, "Cannot cancel after ride in_transit or completed");
    }

   const cancledRideByDriver = await Ride.findByIdAndUpdate(
        rideId,
        { driver : null, 
          status: rideStatus.REQUESTED,
         $unset: { "timeStamps.acceptedAt": ""}
        },
        {
            new:true,
            runValidators: true
        }
        )

        if(!cancledRideByDriver){
            throw new AppError(401,"ride not cancled")
        }

     await Driver.findByIdAndUpdate(driver._id, {isAvailable: true, currentRide: null})

     return cancledRideByDriver
}


const setOnlineStatus = async(payload: iDriver, decodedToken: JwtPayload)=>{

   

    const driver = await Driver.findOne({user: decodedToken.userId})

    if(!driver){
        throw new AppError(401,"driver not found")
    }

 

    if(driver.isSuspend || !driver.isApproved || driver.currentRide!== null){
        throw new AppError(401,"you cannot change now")
    }

  
    //   console.log(payload)

    const updateOnlineStatus = await Driver.findByIdAndUpdate( driver._id, {onlineStatus: payload.onlineStatus}, {new: true, runValidators: true})

    return updateOnlineStatus



}


const updateRideStatus = async(rideId: string,payload: iRide, decodedToken: JwtPayload)=>{

    const user = await User.findById(decodedToken.userId)

    if(!user){
        throw new AppError(401,"user not found")
    }

    if(user.role !== Role.DRIVER){
        throw new AppError(401,"you cannot change it")
    }

    const driver = await Driver.findOne({user: user._id})

    if(!driver){
        throw new AppError(401,"driver not found")
    }


    if(driver.currentRide === null ){
        throw new AppError(401,"you have no ride to change ride status")
    }

    const ride = await Ride.findById(rideId)

    if(!ride){
        throw new AppError(401,"ride not found")
    }

    

    if (![
        rideStatus.PICKED_UP, 
        rideStatus.IN_TRANSIT, 
        rideStatus.COMPLETED
    ].includes(payload.status as rideStatus)) {
        throw new AppError(400, "Invalid ride status value");
    }


    let timeStampField = "";

    if(payload.status===rideStatus.PICKED_UP) {
       timeStampField = "timeStamps.pickedUpAt"
    }
    if(payload.status===rideStatus.IN_TRANSIT){
      timeStampField = "timeStamps.inTransitAt"
    } 
    if(payload.status===rideStatus.COMPLETED){
    timeStampField = "timeStamps.completedAt"
    }

    const update: any = { status: payload.status };
    if(timeStampField){
      update[timeStampField] = new Date();
    } 

    const updatedRide = await Ride.findByIdAndUpdate(rideId, update, { new: true, runValidators: true });

    return updatedRide;




}

const getAvaiblableRidesForDriver = async(decodedToken: JwtPayload) =>{

    const driver = await Driver.findOne({user: decodedToken.userId})

    if(!driver){
        throw new AppError(400, "cannot see this route");
    }

    const availableRequest = await Ride.find({status: rideStatus.REQUESTED}).select("pickupLocation dropLocation isCancelledByRider createdAt").sort({createdAt: -1})

    return availableRequest

}
const viewEarnignHistory = async()=>{

}


export const driverService = {createDriver,acceptedRide, setOnlineStatus,updateRideStatus,viewEarnignHistory,allDriver,approvedDriver,suspenseDriver,getAvaiblableRidesForDriver,cancledRideByDriver}