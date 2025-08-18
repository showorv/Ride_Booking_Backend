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


process.on("unhandledRejection", (err)=>{
    console.log("unhandle rejection detected... server shutting down..",err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})


process.on("uncaughtException", (err)=>{
    console.log("uncaught exception detected... server shutting down..",err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

process.on("SIGTERM", ()=>{
    console.log("sigterm signal recived... server shutting down..");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

process.on("SIGINT", ()=>{
    console.log("sigintsignal recived... server shutting down..");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})