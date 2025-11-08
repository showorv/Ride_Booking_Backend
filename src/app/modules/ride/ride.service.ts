import { JwtPayload } from "jsonwebtoken"
import { iRide, rideStatus } from "./ride.interface"
import { Role } from "../user/user.interface"
import AppError from "../../ErrorHelpers/AppError"
import { User } from "../user/user.model"
import { Ride } from "./ride.model"
import { Driver } from "../driver/driver.model"


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

const getRiderRequestedRides = async (decodedToken: JwtPayload) => {
  const riderId = decodedToken.userId;

  const rides = await Ride.find({
    rider: riderId,
    status: "REQUESTED", // only requested rides
  }).sort({ createdAt: -1 });

  return rides;
};

// const getAllRide = async (query: any) => {

//   const { page = 1, limit = 10, search = "", status, startDate, endDate } = query;

//   const filter: any = {};

//   if (status) filter.status = status;

  
//   if (search) {
//     filter.$or = [
//       { "driver.name": { $regex: search, $options: "i" } },
//       { "rider.name": { $regex: search, $options: "i" } },
//     ];
//   }


//   if (startDate || endDate) {
//     filter["timeStamps.completedAt"] = {};
//     if (startDate) filter["timeStamps.completedAt"].$gte = new Date(startDate);
//     if (endDate) filter["timeStamps.completedAt"].$lte = new Date(endDate);
//   }

//   const skip = (Number(page) - 1) * Number(limit);

//   const [rides, total] = await Promise.all([
//     Ride.find(filter)
//       .populate("driver", "vehicleNumber user")
//       .populate("rider", "name email phone")
//       .skip(skip)
//       .limit(Number(limit))
//       .sort({ "timeStamps.completedAt": -1 }),
//     Ride.countDocuments(filter),
//   ]);

//   return {
//     data: rides,
//     meta: {
//       total,
//       page: Number(page),
//       limit: Number(limit),
//     },
//   };
// };

const getAllRide = async (query: any) => {
  const { page = 1, limit = 10, search = "", status, startDate, endDate } = query;

  const skip = (Number(page) - 1) * Number(limit);


  const match: any = {};

  if (status) match.status = status;

  if (startDate || endDate) {
    match["timeStamps.completedAt"] = {};
    if (startDate) match["timeStamps.completedAt"].$gte = new Date(startDate);
    if (endDate) match["timeStamps.completedAt"].$lte = new Date(endDate);
  }


  const pipeline: any[] = [
    { $match: match },

  
    {
      $lookup: {
        from: "drivers",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
    { $unwind: "$driver" },
    {
      $lookup: {
        from: "users",
        localField: "driver.user",
        foreignField: "_id",
        as: "driverUser",
      },
    },
    { $unwind: "$driverUser" },


    {
      $lookup: {
        from: "users",
        localField: "rider",
        foreignField: "_id",
        as: "riderUser",
      },
    },
    { $unwind: { path: "$riderUser", preserveNullAndEmptyArrays: true } },
  ];


  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "driverUser.name": { $regex: search, $options: "i" } },
          { "driverUser.email": { $regex: search, $options: "i" } },
          { "riderUser.name": { $regex: search, $options: "i" } },
          { "riderUser.email": { $regex: search, $options: "i" } },
        ],
      },
    });
  }


  const countPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await Ride.aggregate(countPipeline);
  const total = totalResult[0]?.total || 0;


  pipeline.push(
    { $sort: { "timeStamps.completedAt": -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  );


  const rides = await Ride.aggregate(pipeline);


  const mappedRides = rides.map((ride) => ({
    ...ride,
    driver: {
      ...ride.driver,
      user: ride.driverUser,
    },
    rider: ride.riderUser || null,
  }));

  return {
    data: mappedRides,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  };
};

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
  const getAnalyticsData = async () => {

    const totalUsers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.find({ status: "COMPLETED" });
    const totalRevenue = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
  
    const activeDrivers = await Driver.countDocuments({ onlineStatus: "ONLINE" });
  
    return {
      totalUsers,
      totalDrivers,
      totalRides,
      totalRevenue,
      activeDrivers,
    };
  };

export const rideService = 
{
    rideRequest,
     cancleRide, 
     getAllRide, 
     rideHistory,
     getRideDetails,
     getAnalyticsData,
     getRiderRequestedRides
}