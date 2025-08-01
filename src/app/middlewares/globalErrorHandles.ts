import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/envVars"
import AppError from "../ErrorHelpers/AppError";


interface iError {
    path: string,
    message: string
}


export const globalError = (err:any, req: Request, res: Response, next: NextFunction)=>{

    let statuscode = 500;
    let message = ` something went wrong `;
    let errorSources: iError[] = [
    //     {
    //     path: "",
    //     message: ""
    // }
];


    
    if(err.code === 11000){

        const matchArray = err.message.match(/"([^"]*)"/) // regx
         statuscode = 400;
        message = `${matchArray[1]} already exist`

    }else if(err.name === "CastError"){
        statuscode = 400;
        message = "Invalid Mongodb ObjectId"

        errorSources.push({
            path: err.path,
            message: `Invalid value for ${err.path}`,
        });

    }else if(err.name === "ValidationError"){
        statuscode= 400;

        const errors = Object.values(err.errors) 
                                           

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))

        message = " mongoose Validation error"


    }else if(err.name === "ZodError"){

        statuscode= 400
        message = "Zod validation error"

        err.issues.forEach((issue:any)=> errorSources.push({
            path: issue.path[ issue.path -1],  
            message: issue.message
        }))

    }
    else if( err instanceof AppError){
        statuscode = err.statusCode,
        message = err.message



    }else if(err instanceof Error){ 
        statuscode = 500,
        message = err.message


    }
    res.status(statuscode).json({
        success: false,
        message,
        errorSources, 
        err: envVars.NODE_DEV === "development"? err : null,
        stack: envVars.NODE_DEV=== "development" ? err.stack : null
    })
}