import express from "express"
import { protect } from "../middleware/authMiddleware"
import { createCheckoutSession, getUserTickets } from "../controllers/ticketController"
import { validateCreateCheckoutSession } from "../middleware/validationMiddleware"

const router = express.Router()

router.get("/user", protect, getUserTickets)
router.post("/create-checkout-session", protect, validateCreateCheckoutSession, createCheckoutSession)

export default router