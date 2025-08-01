import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";

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
] 

moduleRouters.forEach ((routes)=>{
    router.use(routes.path, routes.route)
})