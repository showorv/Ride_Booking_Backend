import { JwtPayload } from "jsonwebtoken"
import { RideHistoryFilters, activeStatus, iDriver } from "./driver.interface"
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

    if(!rider.isVerified){
        throw new AppError(401,"you are not verified")
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

    const total = await Driver.countDocuments()

    const drivers = await Driver.find();
    return  {
        
        data: drivers,
        meta: total
    }
}

const getDriverByUserId = async (userId: string) => {
    const driver = await Driver.findOne({ user: userId });
  
    if (!driver) {
      throw new AppError(401, "Driver not found");
    }
  
    return driver;
  };
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


const setOnlineStatus = async(payload:Partial<iDriver> , decodedToken: JwtPayload)=>{

   

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

    if(driver.currentRide?.toString() !== ride._id.toString()){
        throw new AppError(403, "You can only update your assigned ride");
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

    if(!updatedRide){
        throw new AppError(401,"update ride wrong")
    }

    if(payload.status === rideStatus.COMPLETED){
        await Driver.findByIdAndUpdate(driver._id, {isAvailable: true,currentRide: null, totalEarning: driver.totalEarning as number + ride.fare}, {runValidators:true})
    }

    return updatedRide;




}

const getActiveRideForDriver = async (decodedToken: JwtPayload) => {
    const driver = await Driver.findOne({ user: decodedToken.userId });
  
    if (!driver) {
      throw new AppError(403, "Driver not found");
    }
  
    if (!driver.currentRide) {
      return null; // No active ride
    }
  
    const ride = await Ride.findById(driver.currentRide)
      .populate("driver", "name phone vehicleNumber") // optional
      .select("pickupLocation dropLocation fare status timeStamps");
  
    if (!ride) {
      throw new AppError(403, "Active ride not found");
    }
  
    return ride;
  };
const getAvaiblableRidesForDriver = async(decodedToken: JwtPayload) =>{

    const driver = await Driver.findOne({user: decodedToken.userId})

    if(!driver){
        throw new AppError(400, "cannot see this route");
    }

    const availableRequest = await Ride.find({status: rideStatus.REQUESTED}).select("pickupLocation dropLocation fare isCancelledByRider createdAt").sort({createdAt: -1})

    return availableRequest

}

const viewEarnignHistory = async(decodedToken: JwtPayload)=>{

    const driver = await Driver.findOne({user: decodedToken.userId})

    if(!driver){
        throw new AppError(401,"You are not a driver")
    }

    const earningHistory = await Ride.find(
        {
        driver: driver._id, 
        status: rideStatus.COMPLETED
    }).select("fare timeStamps.completedAt").sort({"timeStamps.completedAt":-1})
     

    return earningHistory



}

// const driverRideHistory = async(decodedToken: JwtPayload)=>{

//     const driver = await Driver.findOne({user: decodedToken.userId})

//     if(!driver){
//         throw new AppError(401,"You are not a driver")
//     }

//     const driverRide = await Ride.find(
//         {
//         driver: driver._id, 
//         status: rideStatus.COMPLETED
//     }).populate("rider", "name phone profile")
//      .sort({"timeStamps.completedAt": -1})

//     return driverRide

    

// }

const driverRideHistory = async (decodedToken: JwtPayload, filters: RideHistoryFilters) => {
    const driver = await Driver.findOne({ user: decodedToken.userId });
    if (!driver) {
      throw new AppError(401, "You are not a driver");
    }
  
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
    const skip = (page - 1) * limit;
  
    const query: any = {
      driver: driver._id,
      status: rideStatus.COMPLETED,
    };
  

    if (filters.fromDate || filters.toDate) {
      query["timeStamps.completedAt"] = {};
      if (filters.fromDate) query["timeStamps.completedAt"].$gte = new Date(filters.fromDate);
      if (filters.toDate) query["timeStamps.completedAt"].$lte = new Date(filters.toDate);
    }
  

    const totalRides = await Ride.countDocuments(query);
  
    const driverRides = await Ride.find(query)
      .populate("rider", "name phone profile")
      .sort({ "timeStamps.completedAt": -1 })
      .skip(skip)
      .limit(limit);
  
    return {
      totalRides,
      currentPage: page,
      totalPages: Math.ceil(totalRides / limit),
      rides: driverRides,
    };
  };

export const driverService =
 {
    createDriver,
    acceptedRide, 
    setOnlineStatus,
    updateRideStatus,
    viewEarnignHistory,
    allDriver,
    approvedDriver,
    suspenseDriver,
    getAvaiblableRidesForDriver,
    cancledRideByDriver,
    driverRideHistory,
    getDriverByUserId,
    getActiveRideForDriver
}