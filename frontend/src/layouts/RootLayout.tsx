import Header from "@/components/Header"
import { Outlet, useLocation } from "react-router"

const RootLayout = () => {
    const { pathname } = useLocation()
    const noPaddingRoutes = ["/dashboard"]

    const isNoPadding = noPaddingRoutes.includes(pathname)

    return (
        <div>
            <Header />
            <div className={isNoPadding ? "" : "py-4"}>
                <Outlet />
            </div>
        </div>
    )
}
export default RootLayout