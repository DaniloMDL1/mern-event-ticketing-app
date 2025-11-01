import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
    const { user } = useAuthContext()

    return user ? <Outlet /> : <Navigate to={"/signin"} replace/>
}
export default ProtectedRoute