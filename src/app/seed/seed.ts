import { envVars } from "../config/envVars";
import { Role, iAuths, iUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs"

export const superAdmin =async ()=>{
    try {
        
        const superAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL })

        if(superAdminExist){
            console.log("super admin already exist");
            return;
            
        }
        if(!superAdminExist){
            console.log("super admin creating");
            
        }

        const hashedPassword =await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD as string, Number(envVars.HASH_SALT)) 

        const authProvider : iAuths = {
            provider: "credientials",
            providerId: envVars.SUPER_ADMIN_EMAIL as string
        }

        const payload: iUser = {
            name: "Super admin",
            email: envVars.SUPER_ADMIN_EMAIL as string,
            password: hashedPassword,
            role: Role.SUPERADMIN,
            auths: [authProvider],
            isVerified:  true
        }

        const superAdmin = await User.create(payload)
        console.log("super admin created");
        console.log(superAdmin);
        
        


    } catch (error) {
        console.log(error);
        
    }
}