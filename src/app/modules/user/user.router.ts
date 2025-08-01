import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()

router.post ("/create", userController.createUser);
router.get ("/",
// checkAuth(Role.ADMIN, Role.SUPERADMIN), 
userController.getAllUser);
router.patch("/:id", checkAuth(...Object.values(Role)), userController.updateUser)

export const userRoutes = router