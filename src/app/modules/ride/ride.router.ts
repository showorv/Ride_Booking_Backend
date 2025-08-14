import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { rideController } from "./ride.controller";


const router = Router()

router.post("/requested", checkAuth(Role.RIDER), rideController.rideRequest)
router.get("/getAll", checkAuth(Role.ADMIN, Role.SUPERADMIN), rideController.getAllRide)
router.get("/ride-history", checkAuth(Role.RIDER), rideController.rideHistory)
router.post("/cancle/:rideId", checkAuth(Role.RIDER), rideController.cancleRide)

export const rideRouter = router