import mongoose, { Schema, model } from "mongoose";
import { activeStatus, iDriver } from "./driver.interface";


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
        default: null
       
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    license:{
        type: [String],
        required: true
    },
    onlineStatus: {
        type: String,
        enum: Object.values(activeStatus),
        default: activeStatus.ONLINE
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    isSuspend:{
        type: Boolean,
        default: false
    },
    isAvailable:{
        type: Boolean,
        default: true
       
    },
    totalEarning: {
        type: Number
    }

},{
    versionKey:false,
    timestamps:true
})


export const Driver = model<iDriver>("Driver", driverSchema)