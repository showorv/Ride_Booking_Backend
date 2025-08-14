import mongoose, { Schema, model } from "mongoose";
import { availableStatus, iDriver } from "./driver.interface";


const driverSchema = new Schema<iDriver>({
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    currentRide: {
        type: mongoose.Schema.ObjectId,
        ref:"Ride",
       
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    license:{
        type: [String],
        required: true
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    isAvailable:{
        type: String,
        enum: Object.values(availableStatus),
        default: availableStatus.OFFLINE
    },
    totalEarning: {
        type: Number
    }

},{
    versionKey:false,
    timestamps:true
})


export const Driver = model<iDriver>("Driver", driverSchema)