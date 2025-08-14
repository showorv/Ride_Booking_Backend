import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { rideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const rideRequest = catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user

    const ride = await rideService.rideRequest(req.body, decodedToken as JwtPayload)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ride requested successfully",
        data: ride
       
    })
})
const cancleRide = catchAsyncError(async(req: Request, res: Response)=>{

    const rideId = req.params.rideId
    const decodedToken = req.user

    const ride = await rideService.cancleRide(rideId, decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ride cancle successfully",
        data: ride
       
    })
})
const getAllRide = catchAsyncError(async(req: Request, res: Response)=>{

    const allRide = await rideService.getAllRide();
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "all ride retrived successfully",
        data: allRide
       
    })
})
const rideHistory = catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user

    const rideHistory = await rideService.rideHistory(decodedToken as JwtPayload)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ride history retrived successfully",
        data: rideHistory
       
    })
})
// const rateDriver = catchAsyncError(async(req: Request, res: Response)=>{

//   const rate = await rideService.rateDriver()

     
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "ride history retrived successfully",
//         data: rate
       
//     })
// })



export const rideController = {rideRequest, cancleRide, getAllRide, rideHistory}