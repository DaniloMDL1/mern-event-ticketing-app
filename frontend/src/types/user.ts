export type UserType = {
    _id: string,
    username: string,
    email: string,
    password: string,
    location?: string,
    role: "user" | "admin",
    createdAt: Date,
    updatedAt: Date
}

export type SafeUserType = Omit<UserType, "password">

export type SignUpPayloadType = Pick<UserType, "username" | "email" | "password">

export type SignInPayloadType = Pick<UserType, "email" | "password">