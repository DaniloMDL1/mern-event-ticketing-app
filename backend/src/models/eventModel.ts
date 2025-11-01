import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        location: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        totalTickets: {
            type: Number,
            required: true
        },
        soldTickets: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Event = mongoose.model("Event", eventSchema)

export default Event