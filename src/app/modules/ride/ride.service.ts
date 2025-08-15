import { JwtPayload } from "jsonwebtoken"
import { iRide, rideStatus } from "./ride.interface"
import { Role } from "../user/user.interface"
import AppError from "../../ErrorHelpers/AppError"
import { User } from "../user/user.model"
import { Ride } from "./ride.model"


const rideRequest = async(payload: iRide, decodedToken: JwtPayload)=>{
    
    const rider = await User.findById(decodedToken.userId);

    if(!rider){
        throw new AppError(401,"rider not found")
    }

    if(rider.role!==Role.RIDER){
        throw new AppError(401,"only rider can request for a ride")
    }

    const {pickupLocation,dropLocation} = payload

    const existingRide = await Ride.findOne({
        rider: rider._id,
        status: {$in: [rideStatus.REQUESTED, rideStatus.ACCEPTED, rideStatus.PICKED_UP, rideStatus.IN_TRANSIT]}
    })

    if(existingRide){
        throw new AppError(401,"ride already request for a ride")
    }

    const ride = await Ride.create({
        rider: rider._id,
        pickupLocation,
        dropLocation,
        status: rideStatus.REQUESTED,
        timeStamps: {
            requestedAt: new Date()
        }
    })


    return ride;



}
const cancleRide = async(rideId: string, decodedToken: JwtPayload)=>{

    const rider = await User.findById(decodedToken.userId);

    if(!rider){
        throw new AppError(401,"rider not found")
    }

    const ride = await Ride.findById(rideId)

    if(!ride){
        throw new AppError(401,"ride not found")
    }

    if(ride.rider.toString() !== rider._id.toString()){
        throw new AppError(401,"you are not authorized")
    }

    if(ride.status !== rideStatus.REQUESTED){
        throw new AppError(401,"you can only cancle ride before accepted or cancle ride cannot cancle")
    }

 

    const cancleStatus = await Ride.findByIdAndUpdate(rideId,
        { 
        status: rideStatus.CANCELED, 
        isCancelledByRider: true, 
        "timeStamps.canceledAt": new Date()
        }, 
        {new: true, runValidators: true})

    return cancleStatus

}
const getAllRide = async()=>{

    const allRide = await Ride.find()

    return allRide
}
const rideHistory = async(decodedToken: JwtPayload)=>{

    const rider = await User.findById(decodedToken.userId)

    if(!rider){
        throw new AppError(401,"rider not found")
    }

    if(rider.role !== Role.RIDER){
        throw new AppError(401,"only rider can view this")
    }

    const rideHistory = await Ride.find({rider: rider._id}).sort({createdAt: -1}).populate("driver", "name phone profile vehicleNumber")

    return rideHistory
}



export const rideService = {rideRequest, cancleRide, getAllRide, rideHistory}