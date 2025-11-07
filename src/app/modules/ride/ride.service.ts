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

    const {pickupLocation,dropLocation,fare} = payload

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
        fare,
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

    const total = await Ride.countDocuments()
    const allRide = await Ride.find()

    return {
        data: allRide,
        meta: total
    }
}
// const rideHistory = async(decodedToken: JwtPayload)=>{

//     const rider = await User.findById(decodedToken.userId)

//     if(!rider){
//         throw new AppError(401,"rider not found")
//     }

//     if(rider.role !== Role.RIDER){
//         throw new AppError(401,"only rider can view this")
//     }

//     const rideHistory = await Ride.find({rider: rider._id}).sort({createdAt: -1}).populate("driver", "name phone profile vehicleNumber")

//     return rideHistory
// }

const rideHistory = async (decodedToken: JwtPayload, query: any) => {
    const rider = await User.findById(decodedToken.userId);
  
    if (!rider) {
      throw new AppError(401, "Rider not found");
    }
  
    if (rider.role !== Role.RIDER) {
      throw new AppError(401, "Only rider can view this");
    }
  
    const {
      page = 1,
      limit = 10,
      search = "",
      minFare,
      maxFare,
      status,
      startDate,
      endDate,
    } = query;
  
    const skip = (Number(page) - 1) * Number(limit);
  
    const filter: any = { rider: rider._id };
  
    if (status) filter.status = status;
    if (minFare || maxFare) filter.fare = {};
    if (minFare) filter.fare.$gte = Number(minFare);
    if (maxFare) filter.fare.$lte = Number(maxFare);
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
   
    const rides = await Ride.find(filter)
    .populate({
      path: "driver",
      populate: {
        path: "user",
        select: "name phone profile",
        match: search ? { name: { $regex: search, $options: "i" } } : undefined,
      },
      select: "vehicleNumber",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  
    const total = await Ride.countDocuments(filter);
  
    return {
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      rides,
    };
  };

const getRideDetails=  async (rideId: string, decodedToken: JwtPayload) => {

    const ride = await Ride.findById(rideId)
    .populate({
        path: "driver",
        select: "vehicleNumber",
        populate: { path: "user", select: "name phone profile" },
      })

    if (!ride) {
      throw new AppError(404, "Ride not found");
    }

    return ride;
  }


export const rideService = 
{
    rideRequest,
     cancleRide, 
     getAllRide, 
     rideHistory,
     getRideDetails
}