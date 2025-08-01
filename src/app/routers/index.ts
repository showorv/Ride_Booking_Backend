import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";

export const router = Router()

const moduleRouters = [
    {
        path: "/user",
        route: userRoutes

    }
] 

moduleRouters.forEach ((routes)=>{
    router.use(routes.path, routes.route)
})