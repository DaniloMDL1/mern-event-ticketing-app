import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Event from "../models/eventModel"

const getEvents = asyncHandler(async (req: Request, res: Response) => {
    const search = (req.query.search as string) || ""
    const selectedCategories = (req.query.selectedCategories as string) || ""
    const sortBy = (req.query.sortBy as string) || "date"
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    let query: any = {}

    query.endDate = { $gte: new Date() }

    if(search) {
        const searchRegex = new RegExp(search, "i")
        query.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex }
        ]
    }

    if(selectedCategories) {
        const selectedCategoriesArray = selectedCategories.split(",")

        query.category = { $in: selectedCategoriesArray }
    }

    let sort: any = {}

    switch(sortBy) {
        case "date":
            sort = { startDate: 1 }
            break
        case "price":
            sort = { price: 1 }
            break
        case "popularity":
            sort = { soldTickets: -1 }
            break
    }

    const totalEvents = await Event.countDocuments(query)
    const events = await Event.find(query).skip((page - 1) * limit).limit(limit).sort(sort).lean()

    res.status(200).json({
        events,
        pagination: {
            totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
            page
        }
    })
})

const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params

    const event = await Event.findById(eventId)
    if(!event) {
        res.status(404)
        throw new Error("Event not found")
    }

    res.status(200).json(event)
})

export { getEvents, getEvent }