import { Response } from "express";
import { envVars } from "../config/envVars";


interface AuthToken {
    accessToken?: string;
    refreshToken?: string
}

export const setCookies = (res: Response, tokenInfo: AuthToken)=>{

    if(tokenInfo.accessToken){
        res.cookie("access-token", tokenInfo.accessToken, {
            httpOnly: true,
            // secure: envVars.NODE_DEV !== "development",
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }

    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true, 
            // secure: envVars.NODE_DEV !== "development",
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
    }
}