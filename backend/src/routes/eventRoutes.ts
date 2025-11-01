import express from "express"
import { getEvent, getEvents } from "../controllers/eventController"
import { param } from "express-validator"

const router = express.Router()

router.get("/", getEvents)
router.get("/:eventId", param("eventId").isString().notEmpty().withMessage("EventId is required"), getEvent)

export default router