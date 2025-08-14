import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { iDriver } from "./driver.interface";
import { driverService } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";

// for admin

const allDriver= catchAsyncError(async(req: Request, res: Response)=>{


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
    })
})

const approvedDriver= catchAsyncError(async(req: Request, res: Response)=>{


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
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


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
    })
})

const setAvailablity = catchAsyncError(async(req: Request, res: Response)=>{


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
    })
})
const updateRideStatus= catchAsyncError(async(req: Request, res: Response)=>{


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
    })
})
const viewEarnignHistory= catchAsyncError(async(req: Request, res: Response)=>{


     
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: ""
       
    })
})





export const driverController = {createDriver,acceptedRide, setAvailablity,updateRideStatus,viewEarnignHistory,allDriver,approvedDriver}