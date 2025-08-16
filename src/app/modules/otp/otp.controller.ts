import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/response";
import { otpService } from "./otp.service";

const sendOTP = catchAsyncError(async(req: Request, res: Response)=>{

    const {email, name } = req.body

    await otpService.sendOTP(email,name);

    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "otp send successfully",
        data:null,
     
    })
})

const verifyOTP = catchAsyncError(async(req: Request, res: Response)=>{

    const {email, otp} = req.body

    await otpService.verifyOTP(email,otp)
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "otp verified successfully",
        data: null,
        
    })
})

export const otpController = {sendOTP,verifyOTP}