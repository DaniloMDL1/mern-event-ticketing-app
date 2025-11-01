import TicketItem from "@/components/TicketItem"
import TicketItemSkeleton from "@/components/TicketItemSkeleton"
import { Alert, AlertTitle } from "@/components/ui/alert"
import type { TicketType } from "@/types/ticket"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon } from "lucide-react"

const fetchUserTickets = async (): Promise<TicketType[]> => {
    const response = await axios.get("/api/tickets/user")
    return response.data
}

const MyTicketsPage = () => {

    const { data: tickets, isPending, isError } = useQuery({
        queryKey: ["myTickets"],
        queryFn: fetchUserTickets
    })

    return (
        <div className="max-w-7xl mx-auto px-4 space-y-4">
            <h1 className="text-lg font-semibold">My Tickets</h1>

            {isPending && (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <TicketItemSkeleton key={index}/>
                    ))}
                </div>
            )}

            {isError && (
                <div className="flex justify-center">
                    <div>
                        <Alert variant={"destructive"}>
                            <AlertCircleIcon />
                            <AlertTitle>Error fetching tickets data</AlertTitle>
                        </Alert>
                    </div>
                </div>
            )}

            {!isPending && !isError && tickets?.length === 0 && (
                <div className="flex justify-center">
                    <p className="text-lg text-center">No tickets yet</p>
                </div>
            )}

            {!isPending && !isError && tickets?.length > 0 && (
                <div className="flex flex-col gap-4">
                    {tickets.map((ticket) => (
                        <TicketItem key={ticket._id} ticket={ticket}/>
                    ))}
                </div>
            )}

        </div>
    )
}
export default MyTicketsPage