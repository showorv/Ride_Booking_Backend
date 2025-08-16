import { z } from "zod";

export const requestRideValidationSchema = z.object({
    pickupLocation: z.object({
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
        address: z.string().min(3, "Pickup address is required"),
      }),
      dropLocation: z.object({
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
        address: z.string().min(3, "Drop address is required"),
      }),
      fare: z.number().min(1, "Fare is required"),
});