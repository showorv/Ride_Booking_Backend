import { Schema, model } from "mongoose";
import { Role, iUser } from "./user.interface";


const userSchema = new Schema<iUser> ( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    phone: {type: String},
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.RIDER
    }
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<iUser>("User", userSchema);
