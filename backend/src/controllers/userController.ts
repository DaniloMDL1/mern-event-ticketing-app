import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import { Request, Response } from "express"
import generateToken from "../utils/generateToken"

const signup = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const user = await User.findOne({ $or: [{ username }, { email }]})
    if(user) {
        res.status(400)
        throw new Error("Email address or username is already in use")
    }

    const newUser = await User.create({
        username,
        email,
        password
    })

    if(newUser) {
        generateToken(res, newUser._id.toString())

        const newUserObj = newUser.toObject()
        const { password: _, ...userInfo } = newUserObj

        res.status(201).json(userInfo)
    } else {
        res.status(400)
        throw new Error("Failed to create a user")
    }
})

const signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id.toString())

        const userObj = user.toObject()

        const { password: _, ...userInfo } = userObj

        res.status(200).json(userInfo)
    } else {
        res.status(400)
        throw new Error("Invalid email address or password")
    }
    
})

const signout = asyncHandler(async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Signed out successfully" })
})

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, location } = req.body
    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    if(username && username !== user.username) {
        const usernameExists = await User.findOne({ username })
        if(usernameExists) {
            res.status(400)
            throw new Error("Username is already in use")
        }

        user.username = username
    }

    if(email && email !== user.email) {
        const emailExists = await User.findOne({ email })
        if(emailExists) {
            res.status(400)
            throw new Error("Email address is already in use")
        }

        user.email = email
    }

    if(password) {
        user.password = password
    }

    user.location = location || user.location

    const updatedUser = await user.save()

    const updatedUserObj = updatedUser.toObject()

    const { password: _, ...userInfo } = updatedUserObj

    res.status(200).json(userInfo)
})

export { signup, signin, signout, updateUserProfile }