import type { EventType } from "./event"
import type { SafeUserType } from "./user"

type TicketStatusType = "pending" | "paid" | "canceled"

export type TicketType = {
    _id: string,
    event: EventType,
    user: SafeUserType,
    userInformation: {
        username: string,
        email: string,
        location: string
    },
    quantity: number,
    totalPrice: number,
    status: TicketStatusType,
    createdAt: Date,
    updatedAt: Date
}