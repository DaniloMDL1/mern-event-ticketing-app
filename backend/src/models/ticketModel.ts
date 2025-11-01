import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userInformation: {
            username: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            }
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        totalPrice: {
            type: Number
        },
        status: {
            type: String,
            enum: ["pending", "paid", "canceled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket