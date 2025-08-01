import cookieParser from "cookie-parser";
import express, { Application } from "express"
import cors from "cors"
import { globalError } from "./app/middlewares/globalErrorHandles";
import { routeNotFound } from "./app/middlewares/routenotFound";
import { router } from "./app/routers";


const app: Application = express();

app.use(cors())

app.use(cookieParser())
app.use(express.json())


app.use("/api/v1", router)

app.use ("/", (req,res)=>{
    
    res.send("server on");
})

app.use(globalError)

app.use(routeNotFound)

export default app;