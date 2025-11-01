import { useAuthContext } from "@/context/AuthContext"
import { Link } from "react-router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { CircleUser } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Spinner } from "./ui/spinner"
import { toast } from "react-toastify"

const Header = () => {
    const { user, signout } = useAuthContext()

    const { mutate: signOutUser, isPending: isSignOutUserPending } = useMutation<{ message: string }, AxiosError<{ message: string}>, void>({
        mutationFn: async () => {
            const response = await axios.post("/api/users/signout")
            return response.data
        },
        onSuccess: (data) => {
            signout()
            toast.success(data.message)
        },
        onError: (error) => {
            toast.error(error?.response?.data.message)
        }
    })

    return (
        <div className="sticky top-0 bg-background z-50">
            <div className="flex justify-between items-center h-20 gap-4 max-w-5xl mx-auto px-4">
                <div className="">
                    <Link className="text-xl font-semibold hover:underline hover:text-primary-purple/90" to={"/"}>
                        Ticket.com
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer">
                                    <span className="flex items-center gap-1">
                                        <CircleUser className="text-primary-purple size-6"/>
                                        <span>{user.username}</span>
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to={"/update-profile"}>Update Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {user.role === "admin" && (
                                        <>
                                            <DropdownMenuItem>
                                                <Link to={"/dashboard?tab=overview"}>Dashboard</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem>
                                        <Link to={"/my-tickets"}>My Tickets</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Button onClick={() => signOutUser()} disabled={isSignOutUserPending} className="w-full bg-primary-purple hover:bg-primary-purple/90 cursor-pointer">
                                            {isSignOutUserPending ? <Spinner className="size-6 text-white"/> : "Sign Out"}
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link className="hover:text-primary-purple/90 hover:underline" to={"/signup"}>Sign Up</Link>
                            <Link className="hover:text-primary-purple/90 hover:underline" to={"/signin"}>Sign In</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Header