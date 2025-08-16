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

router.get("/drivers", 
checkAuth(Role.ADMIN, Role.SUPERADMIN),
driverController.allDriver)

router.post("/update-online-status", 
checkAuth(Role.DRIVER),
driverController.setOnlineStatus)

router.get("/requested-ride", 
checkAuth(Role.DRIVER),
driverController.getAvaiblableRidesForDriver)

router.get("/ride-history", 
checkAuth(Role.DRIVER),
driverController.driverRideHistory)

router.get("/earning-history", 
checkAuth(Role.DRIVER),
driverController.viewEarnignHistory)


router.post("/approve/:driverId", 
checkAuth(Role.ADMIN, Role.SUPERADMIN),
driverController.approvedDriver)
router.post("/suspense/:driverId", 
checkAuth(Role.ADMIN, Role.SUPERADMIN),
driverController.suspenseDriver)

router.post("/accepted/:rideId", checkAuth(Role.DRIVER), driverController.acceptedRide)
router.post("/canceled/:rideId", checkAuth(Role.DRIVER), driverController.cancledRideByDriver)
router.post("/updateStatus/:rideId", checkAuth(Role.DRIVER), driverController.updateRideStatus)



export const driverRouter = router