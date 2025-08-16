import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { iDriver } from "./driver.interface";
import { driverService } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";

// for admin

const approvedDriver= catchAsyncError(async(req: Request, res: Response)=>{

    const  driverId = req.params.driverId


    const driver = await driverService.approvedDriver(driverId, req.body)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "driver approved successfully",
        data:driver
       
    })
})
const suspenseDriver= catchAsyncError(async(req: Request, res: Response)=>{

    const  driverId = req.params.driverId


    const driver = await driverService.suspenseDriver(driverId, req.body)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "driver suspend successfully",
        data:driver
       
    })
})

const allDriver= catchAsyncError(async(req: Request, res: Response)=>{

    const drivers = await driverService.allDriver()
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "drivers retrived successfully",
        data: drivers
       
    })
})
const createDriver = catchAsyncError(async(req: Request, res: Response)=>{

        const payload: iDriver = {
            ...req.body,
            license: (req.files as Express.Multer.File[])?.map(file => file.path)
        }

        const decodedToken = req.user

        const driver = await driverService.createDriver(payload, decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "driver created successfully",
        data: driver
       
    })
})

const acceptedRide = catchAsyncError(async(req: Request, res: Response)=>{

    const rideId = req.params.rideId

    const decodedToken = req.user

    const ride = await driverService.acceptedRide(rideId, decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "accept ride successfully",
        data: ride
       
    })
})

const cancledRideByDriver = catchAsyncError(async(req: Request, res: Response)=>{

    const rideId = req.params.rideId

    const decodedToken = req.user

    const ride = await driverService.cancledRideByDriver(rideId, decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "cancle the  ride successfully",
        data: ride
       
    })
})

const setOnlineStatus = catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user
    

    const updateOnlineStatus = await driverService.setOnlineStatus(req.body, decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "set online status successfully",
        data: updateOnlineStatus
       
    })
})
const updateRideStatus= catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user

    const rideId = req.params.rideId

    const status = await driverService.updateRideStatus(rideId,req.body,decodedToken as JwtPayload)
     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ride status updated successfully",
        data:status
       
    })
})
const getAvaiblableRidesForDriver= catchAsyncError(async(req: Request, res: Response)=>{
     const decodedToken = req.user

     const availableRequest = await driverService.getAvaiblableRidesForDriver(decodedToken as JwtPayload)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "requested ride get successfully",
        data: availableRequest
       
    })
})
const viewEarnignHistory= catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user

    const earningHistory = await driverService.viewEarnignHistory(decodedToken as JwtPayload)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "earning history retrived successfully",
        data: earningHistory
       
    })
})

const driverRideHistory= catchAsyncError(async(req: Request, res: Response)=>{

    const decodedToken = req.user

    const driverRide = await driverService.driverRideHistory(decodedToken as JwtPayload)

     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "driver ride history retrived successfully",
        data: driverRide
       
    })
})







export const driverController = {createDriver,acceptedRide, cancledRideByDriver,setOnlineStatus,updateRideStatus,viewEarnignHistory,allDriver,approvedDriver,suspenseDriver,getAvaiblableRidesForDriver,driverRideHistory}