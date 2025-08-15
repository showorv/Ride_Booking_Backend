import mongoose, { Schema, model } from "mongoose";
import { iRide, rideStatus } from "./ride.interface";


const rideSchema =new Schema<iRide>({
    rider: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
        
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: "Driver",
        default: null
       
    },
    status: {
        type: String,
        enum: Object.values(rideStatus),
        default:rideStatus.REQUESTED
    },
    pickupLocation:{
        lat: {type: Number},
        lng: {type: Number},
        address: {type: String, required: true}
    },
    dropLocation:{
        lat: {type: Number},
        lng: {type: Number},
        address: {type: String, required: true}
    },
    isCancelledByRider: {
        type: Boolean,
        default: false
    },
    timeStamps: {
        requestedAt: { type: Date },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        completedAt: { type: Date },
        cancledAt: { type: Date },
      }
},{
    versionKey:false,
    timestamps: true
})


export const Ride = model<iRide>("Ride",rideSchema)