import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";
import { rideRouter } from "../modules/ride/ride.router";
import { driverRouter } from "../modules/driver/driver.router";

export const router = Router()

const moduleRouters = [
    {
        path: "/user",
        route: userRoutes

    },
    {
        path: "/auth",
        route: authRouter

    },
    {
        path: "/ride",
        route: rideRouter

    },
    {
        path: "/driver",
        route:driverRouter

    },
] 

moduleRouters.forEach ((routes)=>{
    router.use(routes.path, routes.route)
})