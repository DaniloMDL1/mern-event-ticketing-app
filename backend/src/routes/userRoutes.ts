import express from "express"
import { signin, signout, signup, updateUserProfile } from "../controllers/userController"
import { validateSignIn, validateSignUp, validateUpdateUserProfile } from "../middleware/validationMiddleware"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/signup", validateSignUp, signup)
router.post("/signin", validateSignIn, signin)
router.post("/signout", signout)
router.put("/profile", protect, validateUpdateUserProfile, updateUserProfile)

export default router