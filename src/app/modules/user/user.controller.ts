import { Request, Response } from "express"
import { catchAsyncError } from "../../utils/catchAsyncError"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
import { iUser } from "./user.interface";


const createUser = catchAsyncError (async( req: Request, res: Response)=>{

    const payload: iUser = {
        ...req.body,
        profile:req.file?.path
    }

    const user = await userService.createUser(payload);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User created successfully",
        data: user
})
   
})

const getAllUser = catchAsyncError (async( req: Request, res: Response)=>{

    const result = await userService.getAllUser(req.query);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User retrived successfully",
        data: result.data,
        metaData: result.meta 
})

   
})
const blockUser = catchAsyncError(async (req: Request, res: Response) => {
    const result = await userService.blockUser(req.params.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rider blocked successfully",
      data: result,
    });
  });
  const unblockUser = catchAsyncError(async (req: Request, res: Response) => {
    const result = await userService.unBlockUser(req.params.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rider unblocked successfully",
      data: result,
    });
  });

const getSingleUser = catchAsyncError (async( req: Request, res: Response)=>{

    const userId = req.params.userId

    const user = await userService.getSingleUser(userId)

    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user get successfully",
        data: user,
       
    })
   
})
const updateUser = catchAsyncError(async(req: Request,res: Response)=>{

    const userId = req.params.id
    
    const tokenVerified = req.user

    const payload: iUser = {
        ...req.body,
        profile: req.file?.path
    }

    const updateUser = await userService.updateUser(userId, payload, tokenVerified as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users updated successfully",
        data: updateUser,
       
    })
})

const getMe = catchAsyncError(async(req: Request,res: Response)=>{

    const decodedToken = req.user as JwtPayload

    const user = await userService.getMe(decodedToken.userId);
    

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "your profile retrived successfully",
        data: user,
       
    })
})


export const userController = 
{
    createUser,
    getAllUser, 
    getSingleUser,
    updateUser,
    getMe,
    blockUser,
    unblockUser
}
