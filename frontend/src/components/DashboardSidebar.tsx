import { useAuthContext } from "@/context/AuthContext"
import { CircleUser, LayoutDashboard, List, PlusCircle } from "lucide-react"
import { useSearchParams } from "react-router"

const DashboardSidebar = () => {
    const { user } = useAuthContext()

    const [searchParams, setSearchParams] = useSearchParams()

    const tab = searchParams.get("tab") || "overview"

    const handleTabChange = (tab: string) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), tab }

        setSearchParams(newParams)
    }
    

    return (
        <div className="w-full sticky top-20 p-2">
            
            <div className="flex flex-col max-md:items-center gap-4">

                <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                        <CircleUser className="text-primary-purple size-14 max-md:size-8"/>
                        <span className="max-md:text-sm">{user?.username}</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div onClick={() => handleTabChange("overview")} className={`p-3 rounded-full hover:bg-neutral-700/50 cursor-pointer flex items-center gap-2 ${tab === "overview" ? "bg-neutral-700/50" : ""}`}>
                        <LayoutDashboard />
                        <span className="max-md:hidden">Dashboard</span>
                    </div>
                    <div onClick={() => handleTabChange("create-event")} className={`p-3 rounded-full hover:bg-neutral-700/50 cursor-pointer flex items-center gap-2 ${tab === "create-event" ? "bg-neutral-700/50" : ""}`}>
                        <PlusCircle />
                        <span className="max-md:hidden">Create Event</span>
                    </div>
                    <div onClick={() => handleTabChange("events")} className={`p-3 rounded-full hover:bg-neutral-700/50 cursor-pointer flex items-center gap-2 ${tab === "events" ? "bg-neutral-700/50" : ""}`}>
                        <List />
                        <span className="max-md:hidden">Events</span>
                    </div>
                    <div onClick={() => handleTabChange("tickets")} className={`p-3 rounded-full hover:bg-neutral-700/50 cursor-pointer flex items-center gap-2 ${tab === "tickets" ? "bg-neutral-700/50" : ""}`}>
                        <List />
                        <span className="max-md:hidden">Tickets</span>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default DashboardSidebar