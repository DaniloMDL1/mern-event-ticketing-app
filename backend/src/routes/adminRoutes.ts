import express from "express"
import { authorizeAdmin, protect } from "../middleware/authMiddleware"
import { createEvent, getEventsForAdmin, getStats, getTicketsForAdmin } from "../controllers/adminController"
import { validateCreateEvent } from "../middleware/validationMiddleware"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

const router = express.Router()

router.get("/stats", protect, authorizeAdmin, getStats)
router.get("/events", protect, authorizeAdmin, getEventsForAdmin)
router.get("/tickets", protect, authorizeAdmin, getTicketsForAdmin)
router.post("/event", protect, authorizeAdmin, upload.single("imageFile"), validateCreateEvent, createEvent)

export default router