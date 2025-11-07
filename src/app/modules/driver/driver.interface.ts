import { Types } from "mongoose";

export enum activeStatus{
    ONLINE="ONLINE",
    OFFLINE="OFFLINE"
}


export interface iDriver {

    user: Types.ObjectId
    vehicleNumber: string
    license: string[]
    isAvailable?:boolean
    isApproved?:boolean
    isSuspend?:boolean
    totalEarning?:number
    currentRide?:Types.ObjectId
    onlineStatus?: activeStatus



}

export interface RideHistoryFilters {
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  }