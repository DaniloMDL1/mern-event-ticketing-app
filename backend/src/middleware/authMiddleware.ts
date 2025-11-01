import jwt, { JwtPayload } from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import User, { IUser } from "../models/userModel"

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token

    token = req.cookies.token

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

            req.user = await User.findById(decoded.userId).select("-password")

            next()
        } catch(error) {
            res.status(401)
            throw new Error("Invalid token - not authorized")
        }

    } else {
        res.status(401)
        throw new Error("No token - not authorized")
    }
})

const authorizeAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403)
        throw new Error("Not authorized as admin")
    }
})

export { protect, authorizeAdmin }