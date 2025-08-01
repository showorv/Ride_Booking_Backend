import { JwtPayload } from "jsonwebtoken";

// for declare types of express for third party packages

declare global{
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}