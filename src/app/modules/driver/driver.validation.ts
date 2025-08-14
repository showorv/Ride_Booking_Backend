import { z } from "zod";

export const createDriverValidationSchema = z.object({
    vehicleNumber: z.string()
      .regex(
        /^(DHAKA|CHITTAGONG|KHULNA|RAJSHAHI|SYLHET|BARISAL|RANGPUR|MYMENSINGH)-METRO-[A-Z]-\d{2}-\d{4}$/,
        "Invalid Bangladeshi vehicle number format"
      ),
    
      totalEarning: z.number().optional()
  });