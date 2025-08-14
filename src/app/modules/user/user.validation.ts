import { z } from "zod";
import {  Role } from "./user.interface";

export const createUserValidation = z.object({
  name: z
    .string()
    .min(2, { message: "name must have min 2 characters" })
    .max(50, { message: "name is too long" }),

  email: z.string().email({ message: "wrong email format" }),

  password: z
    .string()
    .min(6, { message: "password have to minimum 6 char" })
    .regex(/^(?=.*[A-Z]).{6,}$/, {
      message: "Password must include at least one uppercase letter",
    }),

  phone: z
    .string()
    .regex(/^01[1-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladeshi 11-digit number",
    })
    .optional(),


});

export const updateUserValidation = z.object({
  name: z
    .string()
    .min(2, { message: "name must have min 2 characters" })
    .max(50, { message: "name is too long" })
    .optional(),

  // password: z
  //   .string()
  //   .min(6, { message: "password have to minimum 6 char" })
  //   .regex(/^(?=.*[A-Z]).{6,}$/, {
  //     message: "Password must include at least one uppercase letter",
  //   })
  //   .optional(),

  phone: z
    .string()
    .regex(/^01[1-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladeshi 11-digit number",
    })
    .optional(),

  address: z.string().optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),
  isBlocked:z.boolean().optional(),

  isVerified: z.boolean().optional(),
});
