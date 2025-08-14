import { Types } from "mongoose";

export enum availableStatus{
    ONLINE="ONLINE",
    OFFLINE="OFFLINE"
}

export interface iDriver {

    user: Types.ObjectId
    vehicleNumber: string
    license: string[]
    isAvailable?:availableStatus
    isApproved?:boolean
    totalEarning?:number
    currentRide?:Types.ObjectId


}