import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import StatCard from "./StatCard"
import { AlertCircleIcon, BanknoteArrowUp, CalendarDays, Ticket, Users } from "lucide-react"
import StatCardSkeleton from "./StatCardSkeleton"
import type { EventType } from "@/types/event"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { format } from "date-fns"
import { Spinner } from "./ui/spinner"
import { Alert, AlertTitle } from "./ui/alert"
import { CATEGORIES } from "@/utils/categories"
import type { TicketType } from "@/types/ticket"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

type FetchStatsType = {
    totalEvents: number,
    totalTickets: number,
    totalUsers: number,
    totalRevenue: number
}

const fetchStats = async (): Promise<FetchStatsType> => {
    const response = await axios.get("/api/admin/stats")
    return response.data
}

const fetchRecentEvents = async (params = {}): Promise<EventType[]> => {
    const queryString = new URLSearchParams(params).toString()
    const response = await axios.get(`/api/admin/events?${queryString}`)
    return response.data
}

const fetchRecentTickets = async (params = {}): Promise<TicketType[]> => {
    const queryString = new URLSearchParams(params).toString()
    const response = await axios.get(`/api/admin/tickets?${queryString}`)
    return response.data
}

const DashboardOverview = () => {

    const { data: stats, isPending: isStatsPending } = useQuery({
        queryKey: ["stats"],
        queryFn: fetchStats
    })

    const { data: recentEvents, isPending: isRecentEventsPending, isError: isRecentEventsError } = useQuery({
        queryKey: ["recentEvents"],
        queryFn: () => fetchRecentEvents({ sortBy: "recent", limit: "10" })
    })

     const { data: recentTickets, isPending: isRecentTicketsLoading, isError: isRecentTicketsError } = useQuery({
        queryKey: ["recentTickets"],
        queryFn: () => fetchRecentTickets({ sortBy: "recent", limit: "10" })
    })

    const totalRevenue = ((stats?.totalRevenue || 0) / 100).toFixed(2)

    const formatCategory = (category: string) => {
        return CATEGORIES.find((c) => c.value === category)?.label
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>

            {isStatsPending && (
                <div className="flex max-md:flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <StatCardSkeleton key={index}/>
                    ))}
                </div>
            )}
            {!isStatsPending && (
                <div className="flex max-md:flex-col gap-4">
                    <StatCard title={"Total Events"} value={stats?.totalEvents || 0} Icon={CalendarDays}/>
                    <StatCard title={"Total Tickets"} value={stats?.totalTickets || 0} Icon={Ticket}/>
                    <StatCard title={"Total Users"} value={stats?.totalUsers || 0} Icon={Users}/>
                    <StatCard title={"Total Revenue"} value={totalRevenue} Icon={BanknoteArrowUp}/>
                </div>
            )}

            <div className="mt-12">
                <h1 className="text-lg font-semibold">Recent Events</h1>
                {isRecentEventsPending && (
                    <div className="flex justify-center">
                        <Spinner className="size-8 text-primary-purple"/>
                    </div>
                )}

                {isRecentEventsError && (
                    <div className="flex justify-center">
                        <div>
                            <Alert variant={"destructive"}>
                                <AlertCircleIcon />
                                <AlertTitle>Error fetching recent events data</AlertTitle>
                            </Alert>
                        </div>
                    </div>
                )}

                {!isRecentEventsPending && !isRecentEventsError && recentEvents && (
                    <div className="mt-4">
                        <ScrollArea className="pb-3">
                            <Table>
                                <TableCaption>A list of recent events</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>Tickets</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentEvents.map((event) => (
                                        <TableRow key={event._id}>
                                            <TableCell>{event.title}</TableCell>
                                            <TableCell>
                                                {formatCategory(event.category)}
                                            </TableCell>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>{format(new Date(event.startDate), "MMM dd")}</TableCell>
                                            <TableCell>{event.soldTickets}/{event.totalTickets}</TableCell>
                                            <TableCell>${(event.price / 100).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <h1 className="text-lg font-semibold">Recent Tickets</h1>
                {isRecentTicketsLoading && (
                    <div className="flex justify-center">
                        <Spinner className="size-8 text-primary-purple"/>
                    </div>
                )}

                {isRecentTicketsError && (
                    <div className="flex justify-center">
                        <div>
                            <Alert variant={"destructive"}>
                                <AlertCircleIcon />
                                <AlertTitle>Error fetching recent tickets data</AlertTitle>
                            </Alert>
                        </div>
                    </div>
                )}

                {!isRecentTicketsLoading && !isRecentTicketsError && recentEvents && (
                    <div className="mt-4">
                        <ScrollArea className="pb-3">
                            <Table>
                                <TableCaption>A list of recent tickets</TableCaption>
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
                                    {recentTickets.map((ticket) => (
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
export default DashboardOverview