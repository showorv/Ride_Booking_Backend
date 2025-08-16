import { Router } from "express";
import { otpController } from "./otp.controller";


const router = Router()

router.post("/send",otpController.sendOTP)
router.post("/verify",otpController.verifyOTP)

export const otpRouter = router