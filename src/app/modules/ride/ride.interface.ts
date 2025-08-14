import { Types } from "mongoose";

export enum rideStatus {
    REQUESTED= "REQUESTED",
    ACCEPTED= "ACCEPTED",
    PICKED_UP="PICKED_UP",
    IN_TRANSIT="IN_TRANSIT",
    COMPLETED="COMPLETED",
    CANCLED="CANCLED"

}

export interface iRide{
    rider: Types.ObjectId
    
    driver?:Types.ObjectId
    isCancelledByRider:boolean

    pickupLocation: {
        lat?:number
        lng?:number
        address:string
    }
    dropLocation: {
        lat?:number
        lng?:number
        address:string
    }

    status?:rideStatus
    timeStamps: {
        requestedAt:Date
        acceptedAt:Date
        completedAt:Date
        pickedupAt:Date,
        cancledAt: Date
    }



} 