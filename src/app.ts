import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express"
import cors from "cors"
import { globalError } from "./app/middlewares/globalErrorHandles";
import { routeNotFound } from "./app/middlewares/routenotFound";
import { router } from "./app/routers";
import { envVars } from "./app/config/envVars";


const app: Application = express();



app.use(cookieParser())
app.use(express.json());
app.set("trust proxy", 1)
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use("/api/v1", router)

app.get("/",(req: Request,res: Response)=>{
    res.status(200).json({
        message: "Welcome to ride booking api"
    })
})

app.use(globalError)

app.use(routeNotFound)

export default app;