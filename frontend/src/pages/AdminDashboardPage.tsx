import CreateEvent from "@/components/CreateEvent"
import DashboardOverview from "@/components/DashboardOverview"
import DashboardSidebar from "@/components/DashboardSidebar"
import EventsList from "@/components/EventsList"
import TicketsList from "@/components/TicketsList"
import { useSearchParams } from "react-router"

const AdminDashboardPage = () => {

    const [searchParams] = useSearchParams()

    const tab = searchParams.get("tab") || "overview"

    return (
        <div className="h-[calc(100vh-80px)] py-0 flex">

            <div className="h-full flex-[0.2]">
                <DashboardSidebar />
            </div>
            <div className="flex-1 p-4 border-l overflow-y-auto">
                {tab === "overview" && <DashboardOverview />}
                {tab === "create-event" && <CreateEvent />}
                {tab === "events" && <EventsList />}
                {tab === "tickets" && <TicketsList />}
            </div>
        </div>
    )
}
export default AdminDashboardPage