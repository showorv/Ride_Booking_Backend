import { Router } from "express";
import { userController } from "./user.controller";


const router = Router()

router.post ("/create", userController.createUser);
router.get ("/", userController.getAllUser);
router.patch("/:userId", userController.updateUser)

export const userRoutes = router