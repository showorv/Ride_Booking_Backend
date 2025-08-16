import {Server }from "http"
import mongoose from "mongoose"
import app from "./app";
import { envVars } from "./app/config/envVars";
import { superAdmin } from "./app/seed/seed";
import { connectRedis } from "./app/config/redis.config";


let server: Server

async function main() {
    try {
        
        await mongoose.connect(envVars.MONGODB_URL as string);
        
        console.log("db connected");
        

        server = app.listen(envVars.PORT, ()=>{
            console.log (`server listening at ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

(async()=>{
  await connectRedis()
   await main()
   await superAdmin()
})()