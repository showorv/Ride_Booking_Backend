
export enum Role {

    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",

    RIDER = "RIDER",
    DRIVER = "DRIVER",
}

export interface iAuths {
    provider: "credientials" | "google"
    providerId: string
}

export interface iUser {
    _id?: string
    name: string;
    email: string;
    password?: string
    phone?: string
    isBlocked?: boolean
    role: Role,
    auths: iAuths[]
    

}