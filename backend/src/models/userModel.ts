import mongoose, { Document } from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    location?: string,
    role: "user" | "admin",
    matchPassword: (enteredPassword: string) => Promise<Boolean>
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        location: {
            type: String
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre<IUser>("save", async function (next) {
    if(!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model<IUser>("User", userSchema)

export default User