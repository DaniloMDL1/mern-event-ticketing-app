import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router"

const AdminProtectedRoute = () => {
    const { user } = useAuthContext()

    if(!user || user.role !== "admin") {
        return <Navigate to={"/"} replace/>
    }

    return <Outlet />
}
export default AdminProtectedRoute