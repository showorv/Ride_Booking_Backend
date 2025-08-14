import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { driverController } from "./driver.controller";
import { multerUpload } from "../../config/multer.config";
import { validateSchma } from "../../middlewares/validationSchema";
import { createDriverValidationSchema } from "./driver.validation";


const router = Router()

router.post("/create-driver", 
checkAuth(Role.RIDER),
multerUpload.array("files"),
validateSchma(createDriverValidationSchema),
driverController.createDriver)

router.post("/accepted/:rideId", checkAuth(Role.DRIVER), driverController.acceptedRide)



export const driverRouter = router