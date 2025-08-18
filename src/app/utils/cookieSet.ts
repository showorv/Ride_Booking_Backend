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
            secure: envVars.NODE_DEV !== "development",
            sameSite: "none"
        })
    }

    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true, 
            secure: envVars.NODE_DEV !== "development",
            sameSite: "none"
        })
    }
}