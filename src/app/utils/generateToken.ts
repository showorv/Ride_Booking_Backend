import { envVars } from "../config/envVars";
import { iUser } from "../modules/user/user.interface";
import { generateToken } from "./jwtToken";


export const createUserToken = (user: iUser)=>{
  
    const jsonPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jsonPayload, envVars.JWT_ACCESTOKEN_SECRET as string, envVars.JWT_ACCESTOKEN_EXPIRED as string)
    const refreshToken = generateToken(jsonPayload, envVars.JWT_REFRESHTOKEN_SECRET as string, envVars.JWT_REFRESHTOKEN_EXPIRED as string)

    return {
        accessToken,
        refreshToken
    }
}