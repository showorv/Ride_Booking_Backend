import { Request, Response } from "express"
import { catchAsyncError } from "../../utils/catchAsyncError"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"


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

   
})

const getSingleUser = catchAsyncError (async( req: Request, res: Response)=>{

   
})
const updateUser =catchAsyncError (async( req: Request, res: Response)=>{

   
})

export const userController = {createUser,getAllUser, getSingleUser,updateUser}