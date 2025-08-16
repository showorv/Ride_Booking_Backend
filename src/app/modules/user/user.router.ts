import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";
import { validateSchma } from "../../middlewares/validationSchema";
import { createUserValidation, updateUserValidation } from "./user.validation";


const router = Router()

router.post ("/create",
multerUpload.single("file"),
validateSchma(createUserValidation),
 userController.createUser);
router.get ("/",
checkAuth(Role.ADMIN, Role.SUPERADMIN), 
userController.getAllUser);
router.get("/me", checkAuth(...Object.values(Role)), userController.getMe)
router.get("/:userId", checkAuth(Role.ADMIN,Role.SUPERADMIN),userController.getSingleUser)
router.patch("/:id", checkAuth(...Object.values(Role)),
multerUpload.single("file"),
validateSchma(updateUserValidation),
userController.updateUser)

export const userRoutes = router