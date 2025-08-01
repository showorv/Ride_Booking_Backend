import { Request, Response } from "express"
import { catchAsyncError } from "../../utils/catchAsyncError"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsyncError (async( req: Request, res: Response)=>{

    const user = await userService.createUser(req.body);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User created successfully",
        data: user
})
   
})

const getAllUser = catchAsyncError (async( req: Request, res: Response)=>{

    const users  = await userService.getAllUser() 

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User retrived successfully",
        data: users.user,
        metaData: users.meta 
})

   
})

const getSingleUser = catchAsyncError (async( req: Request, res: Response)=>{

   
})
const updateUser = catchAsyncError(async(req: Request,res: Response)=>{

    const userId = req.params.id
    
    const tokenVerified = req.user

    const payload = req.body

    const updateUser = await userService.updateUser(userId, payload, tokenVerified as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users updated successfully",
        data: updateUser,
       
    })
})


export const userController = {createUser,getAllUser, getSingleUser,updateUser}