import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { v2 as cloudinary } from "cloudinary"
import Event from "../models/eventModel"
import Ticket from "../models/ticketModel"
import User from "../models/userModel"

const getStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const totalEvents = await Event.countDocuments()
    const totalTickets = await Ticket.countDocuments()
    const totalUsers = await User.countDocuments()

    const totalRevenueData = await Ticket.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ])

    const totalRevenue = totalRevenueData[0]?.total || 0

    res.status(200).json({
        totalEvents,
        totalTickets,
        totalUsers,
        totalRevenue
    })
})

const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    let imageUrl: string | undefined

    if(req.file) {
        const image = req.file as Express.Multer.File
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataUri = `data:${image.mimetype};base64,${base64Image}`

        const uploadedResponse = await cloudinary.uploader.upload(dataUri)
        imageUrl = uploadedResponse.secure_url
    }
    
    const newEvent = await Event.create({
        ...req.body,
        createdBy: userId,
        imageUrl: imageUrl
    })

    res.status(201).json(newEvent)
})

const getEventsForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortBy = (req.query.sortBy as string) || "recent"

    let sort: any = {}
    if(sortBy) {
        switch(sortBy) {
            case "recent":
                sort = { createdAt: -1 }
                break
        }
    }

    let query = Event.find().sort(sort)

    if(limit) {
        query = query.limit(limit)
    }

    const events = await query

    res.status(200).json(events)
})

const getTicketsForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortBy = (req.query.sortBy as string) || "recent"

    let sort: any = {}
    if(sortBy) {
        switch(sortBy) {
            case "recent":
                sort = { createdAt: -1 }
                break
        }
    }

    let query = Ticket.find().populate("event").populate({ path: "user", select: "-password"}).sort(sort)

    if(limit) {
        query = query.limit(limit)
    }

    const tickets = await query

    res.status(200).json(tickets)
})

export { getStats, createEvent, getEventsForAdmin, getTicketsForAdmin }