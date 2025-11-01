import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }
    next()
}

const validateSignUp = [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password").trim().isStrongPassword({ minLength: 6, minUppercase: 0, minSymbols: 0 }).withMessage("Password must be at least 6 characters"),
    validate
]

const validateSignIn = [
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password").trim().isStrongPassword({ minLength: 6, minUppercase: 0, minSymbols: 0 }).withMessage("Password must be at least 6 characters"),
    validate
]

const validateUpdateUserProfile = [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password").trim().isStrongPassword({ minLength: 6, minUppercase: 0, minSymbols: 0 }).optional({ values: "falsy" }),
    body("location").isString().trim().optional(),
    validate
]

const validateCreateCheckoutSession = [
    body("userInformation.username").trim().notEmpty().withMessage("Username is required"),
    body("userInformation.email").trim().isEmail().withMessage("Invalid email address"),
    body("userInformation.password").trim().notEmpty().withMessage("Password is required"),
    body("userInformation.location").trim().notEmpty().withMessage("Location is required"),
    validate
]

const validateCreateEvent = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("startDate").isISO8601().toDate().withMessage("Start date is required"),
    body("endDate").isISO8601().toDate().withMessage("End date is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price is required"),
    body("totalTickets").isInt({ min: 0 }).withMessage("Total tickets is required"),
    validate
]

export { validateSignUp, validateSignIn, validateUpdateUserProfile, validateCreateCheckoutSession, validateCreateEvent }