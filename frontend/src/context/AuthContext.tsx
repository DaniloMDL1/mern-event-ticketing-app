import type { SafeUserType } from "@/types/user"
import { createContext, useContext, useState, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type AuthContextType = {
    user: SafeUserType | null,
    setUserInfo: (user: SafeUserType) => void,
    signout: () => void
}

const initialContext: AuthContextType = {
    user: null,
    setUserInfo: (_user: SafeUserType) => {},
    signout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialContext)

export const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<SafeUserType | null>(() => {
        const storedUserInfo = localStorage.getItem("userInfo")
        return storedUserInfo ? JSON.parse(storedUserInfo) : null
    })

    const setUserInfo = (user: SafeUserType) => {
        setUser(user)
        localStorage.setItem("userInfo", JSON.stringify(user))
    }

    const signout = () => {
        setUser(null)
        localStorage.removeItem("userInfo")
    }

    return (
        <AuthContext.Provider 
            value={{ user, setUserInfo, signout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider