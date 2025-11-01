import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import Event from "../models/eventModel"
import Stripe from "stripe"
import Ticket from "../models/ticketModel"

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string

type CreateCheckoutSessionRequestType = {
    eventId: string,
    userInformation: {
        username: string,
        email: string,
        password: string,
        location: string
    },
    quantity: string
}

const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event

    try {
        const signature = req.headers["stripe-signature"]

        event = STRIPE.webhooks.constructEvent(req.body, signature as string, STRIPE_ENDPOINT_SECRET)

    } catch(error: any) {
        console.log(error)
        return res.status(400).json({ message: `Webhook error: ${error.message}`})
    }

    if(event.type === "checkout.session.completed") {

        const ticket = await Ticket.findById(event.data.object.metadata?.ticketId)
        if(!ticket) {
            res.status(404)
            throw new Error("Ticket not found")
        }

        ticket.totalPrice = event.data.object.amount_total
        ticket.status = "paid"

        await ticket.save()

        const eventDoc = await Event.findById(event.data.object.metadata?.eventId)
        if(!eventDoc) {
            res.status(404)
            throw new Error("Event not found")
        }

        const quantity = parseInt(event.data.object.metadata?.quantity || "0")

        eventDoc.soldTickets += quantity

        await eventDoc.save()

    }

    res.status(200).json({ received: true })
}

const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const createCheckoutSessionRequest: CreateCheckoutSessionRequestType = req.body
    const { username, email, password, location } = createCheckoutSessionRequest.userInformation

    const user = await User.findOne({ email })
    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    if(username !== user.username || !(await user.matchPassword(password))) {
        res.status(400)
        throw new Error("User information does not match the account")
    }

    const event = await Event.findById(createCheckoutSessionRequest.eventId)
    if(!event) {
        res.status(404)
        throw new Error("Event not found")
    }

    const newTicket = new Ticket({
        event: event._id,
        user: user._id,
        userInformation: {
            username,
            email,
            location
        },
        quantity: createCheckoutSessionRequest.quantity,
        status: "pending"
    })

    const session = await STRIPE.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: "usd",
                unit_amount: event.price,
                product_data: {
                    name: event.title,
                    description: event.description,
                    images: event.imageUrl ? [event.imageUrl] : []
                },
            },
            quantity: parseInt(createCheckoutSessionRequest.quantity)
        }],
        mode: "payment",
        metadata: {
            eventId: event._id.toString(),
            ticketId: newTicket._id.toString(),
            quantity: createCheckoutSessionRequest.quantity.toString()
        },
        success_url: `${FRONTEND_URL}/my-tickets?success=true`,
        cancel_url: `${FRONTEND_URL}/events/${event._id.toString()}?cancelled=true`
    })

    if(!session.url) {
        res.status(500)
        throw new Error("Error creating stripe new session")
    }

    await newTicket.save()

    res.status(200).json({ url: session.url })
})

const getUserTickets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const tickets = await Ticket.find({ user: userId }).populate("event").populate({ path: "user", select: "-password" }).sort({ createdAt: -1 })

    res.status(200).json(tickets)
})

export { createCheckoutSession, stripeWebhookHandler, getUserTickets }