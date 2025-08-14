import { ZodObject } from "zod"
import{ NextFunction, Request, Response } from "express"

export const validateSchma = (zodSchema:ZodObject)=> async( req: Request, res: Response, next:NextFunction)=>{
    try {
        // const details = req.body.data || req.body 
        // const details =JSON.parse(req.body.data ) || req.body 

        if(req.body.data){
            req.body = JSON.parse(req.body.data)
        }

        req.body = await zodSchema.parseAsync(req.body)
        next()
        
    } catch (error) {
        next(error)
    }
   
}