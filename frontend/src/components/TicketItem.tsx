import type { TicketType } from "@/types/ticket"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"

type Props = {
    ticket: TicketType
}

const TicketItem = ({ ticket }: Props) => {

    const getStatusBadgeVariant = (status: string) => {
        switch(status) {
            case "paid":
                return "default"
            case "pending":
                return "default"
            case "canceled":
                return "destructive"
        }
    }

    return (
        <div className="flex justify-between gap-3 p-4 border rounded-lg shadow-md bg-card">

            <div className="flex gap-3">

                <div className="">
                    <div className="w-28 h-32 max-md:h-full overflow-hidden rounded-lg">
                        <img 
                            src={ticket.event?.imageUrl || "https://placehold.co/1600?text=No+Image"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-medium">{ticket.event.title}</h1>

                            <Badge variant={getStatusBadgeVariant(ticket.status)} className={`${ticket.status === "paid" ? "bg-chart-2 hover:bg-chart-2/90" : ticket.status === "pending" ? "bg-chart-3 hover:bg-chart-3/90" : ""}`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                        </div>
                        <div className="flex items-center max-md:text-sm space-x-4 h-5 mt-2">
                            <div className="text-muted-foreground flex items-center gap-1">
                                <CalendarDays className="size-5 text-muted-foreground"/>
                                {format(new Date(ticket.event.startDate), "MMMM dd")}
                            </div>
                            <Separator orientation="vertical"/>
                        </div>
                        <p className="text-base font-semibold">
                            Location: <span className="text-muted-foreground text-sm">{ticket.event.location}</span>
                        </p>
                        <div className="md:hidden">
                            <div className="flex text-sm items-center gap-1">
                                <span className="font-medium text-muted-foreground">Total:</span>
                                <span className="">${(ticket.totalPrice / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex text-sm items-center gap-1">
                                <span className="font-medium text-muted-foreground">Total Tickets:</span>
                                <span className="">{ticket.quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-md:hidden">
                <div className="flex items-center gap-1">
                    <span className="font-medium text-muted-foreground">Total:</span>
                    <span className="">${(ticket.totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium text-muted-foreground">Total Tickets:</span>
                    <span className="">{ticket.quantity}</span>
                </div>
            </div>
        </div>
    )
}
export default TicketItem