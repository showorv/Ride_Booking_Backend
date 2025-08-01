import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { authService } from "./auth.service";
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/response";
import { setCookies } from "../../utils/cookieSet";
import AppError from "../../ErrorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";


const login = catchAsyncError(async(req: Request, res: Response)=>{
    
    const user = await authService.login(req.body)

    setCookies(res, user);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User login successfully",
        data: user
        
})
})


const getNewAccessToken = catchAsyncError(async(req: Request, res: Response)=>{

    const token = req.cookies.refreshToken

    if(!token){
        throw new AppError(httpStatus.BAD_REQUEST, "cannot get refreshtoken from cookie")
    }

    const accessToken= await authService.generateNewAccessToken(token as string)



    setCookies(res, accessToken)


    res.status(httpStatus.OK).json({
        success: true,
        message: "User get new accessToken",
        data: accessToken
    })
    
})

const logout = catchAsyncError(async(req: Request, res: Response)=>{

    res.clearCookie("access-token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })


    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged out",
        data: null
    })
    
})

const resetPassword = catchAsyncError(async(req: Request, res: Response)=>{

    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    const decodedToken =  req.user

    await authService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)


    res.status(httpStatus.OK).json({
        success: true,
        message: "password reset successfully",
        data: null
    })
    
})
export const authController = {login,getNewAccessToken,logout,resetPassword}