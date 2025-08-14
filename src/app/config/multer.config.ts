

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {

        public_id: (req,file)=> {

         

            const filename = file.originalname
            .toLowerCase()
            .replace( /\s+g/,"-") 
            .replace(/\.g/, "-") 

            const extensionName = file.originalname.split(".").pop();  

         

            const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + filename + "." + extensionName

            return uniqueName;
            
        }
    }  
})

export const multerUpload = multer({storage: storage})
