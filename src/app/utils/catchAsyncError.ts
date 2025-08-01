import { NextFunction, Request, Response } from "express"

type asyncHandle = (req: Request,res: Response, next: NextFunction) => Promise<void>

export const catchAsyncError = (fn: asyncHandle) => (req: Request,res: Response, next: NextFunction)=>{
    Promise.resolve(fn(req,res,next)).catch(next)
}