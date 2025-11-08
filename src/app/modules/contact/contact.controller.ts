
import { Request, Response } from "express";
import { Contact } from "./contact.model";
import AppError from "../../ErrorHelpers/AppError";


export const submitContact = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new AppError(400, "All fields are required");
  }


  const contact = await Contact.create({ name, email, message });

  res.status(201).json({
    success: true,
    message: "Your inquiry has been submitted successfully",
    data: contact,
  });
};
