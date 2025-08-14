import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./envVars";
import AppError from "../ErrorHelpers/AppError";

cloudinary.config({
    cloud_name:envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVars.CLOUDINARY.CLOUDINARY_API_SECRET,

})


export const cloudinaryDeleteUpload = async (url : string)=>{

    try {
        // destroy by public_id

        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex)

        if(match && match[1]){
            const public_id = match[1]

            await cloudinary.uploader.destroy(public_id)

            console.log(`deleted images ${public_id}`);
            
        }
    } catch (error:any) {
        throw new AppError(401, "cloudinary image deletion failed", error.message)
    }

}

export const cloudinaryUpload = cloudinary;