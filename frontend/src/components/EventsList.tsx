import type { EventType } from "@/types/event"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Alert, AlertTitle } from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Spinner } from "./ui/spinner"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { CATEGORIES } from "@/utils/categories"
import { format } from "date-fns"

const fetchAllEvents = async (): Promise<EventType[]> => {
    const response = await axios.get(`/api/admin/events`)
    return response.data
}

const EventsList = () => {

    const { data: events, isPending, isError } = useQuery({
        queryKey: ["allEvents"],
        queryFn: fetchAllEvents
    })

    const formatCategory = (category: string) => {
        return CATEGORIES.find((c) => c.value === category)?.label
    }

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-xl font-semibold">All Events</h1>

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
                                <AlertTitle>Error fetching events data</AlertTitle>
                            </Alert>
                        </div>
                    </div>
                )}

                {!isPending && !isError && events && (
                    <div>
                        <ScrollArea>
                            <Table>
                                <TableCaption>A list of all events</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>Tickets</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event._id}>
                                            <TableCell>{event.title}</TableCell>
                                            <TableCell>{formatCategory(event.category)}</TableCell>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>{format(new Date(event.startDate), "MMM dd")}</TableCell>
                                            <TableCell>
                                                {event.soldTickets}/{event.totalTickets}
                                            </TableCell>
                                            <TableCell>${(event.price / 100).toFixed(2)}</TableCell>
                                            <TableCell>{format(new Date(event.createdAt), "PP")}</TableCell>
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
export default EventsList