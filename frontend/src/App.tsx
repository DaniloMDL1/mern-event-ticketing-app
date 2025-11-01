import { createBrowserRouter, createRoutesFromElements, Route } from "react-router"
import { RouterProvider } from "react-router/dom"
import HomePage from "./pages/HomePage"
import RootLayout from "./layouts/RootLayout"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import { ToastContainer } from "react-toastify"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import MyTicketsPage from "./pages/MyTicketsPage"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import AdminDashboardPage from "./pages/AdminDashboardPage"

const App = () => {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/events/:eventId" element={<EventDetailsPage />}/>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/update-profile" element={<UpdateProfilePage />}/>
                        <Route path="/my-tickets" element={<MyTicketsPage />}/>
                    </Route>

                    <Route element={<AdminProtectedRoute />}>
                        <Route path="/dashboard" element={<AdminDashboardPage />}/>
                    </Route>
                    <Route path="/signup" element={<SignUpPage />}/>
                    <Route path="/signin" element={<SignInPage />}/>
                </Route>
            </>
        )
    )

    return (
        <>
            <RouterProvider router={router}/>
            <ToastContainer theme="dark" autoClose={3000}/>
        </>
    )
}
export default App