import express from "express";
import { submitContact } from "./contact.controller";


const router = express.Router();

router.post("/", submitContact);

export const contactRouter = router;