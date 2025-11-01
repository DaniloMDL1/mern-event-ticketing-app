import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Spinner } from "./ui/spinner"
import { Alert, AlertTitle } from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import type { TicketType } from "@/types/ticket"
import { format } from "date-fns"

const fetchAllTickets = async (): Promise<TicketType[]> => {
    const response = await axios.get(`/api/admin/tickets`)
    return response.data
}

const TicketsList = () => {

    const { data: tickets, isPending, isError } = useQuery({
        queryKey: ["allTickets"],
        queryFn: fetchAllTickets
    })

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-xl font-semibold">All Tickets</h1>

            <div className="mt-4">
                {isPending && (
                    <div className="flex justify-center">
                        <Spinner className="size-8 text-primary-purple"/>
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

                {!isPending && !isError && tickets && (
                    <div>
                        <ScrollArea>
                            <Table>
                                <TableCaption>A list of all tickets</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket._id}>
                                            <TableCell>{ticket.event.title}</TableCell>
                                            <TableCell>
                                                {ticket.user.username}
                                            </TableCell>
                                            <TableCell>{ticket.quantity}</TableCell>
                                            <TableCell>${(ticket.totalPrice / 100).toFixed(2)}</TableCell>
                                            <TableCell>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</TableCell>
                                            <TableCell>{format(new Date(ticket.createdAt), "MMM dd")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                    </div>
                )}

            </div>
        </div>
    )
}
export default TicketsList