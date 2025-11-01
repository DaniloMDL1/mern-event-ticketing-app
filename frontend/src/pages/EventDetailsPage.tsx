import TicketSummary from "@/components/TicketSummary"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import type { EventType } from "@/types/event"
import { skipToken, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { AlertCircleIcon, CalendarDays } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

const fetchEvent = async (eventId: string): Promise<EventType> => {
    const response = await axios.get(`/api/events/${eventId}`)
    return response.data
}

const EventDetailsPage = () => {
    const { eventId } = useParams()

    const { data: event, isPending, isError } = useQuery({
        queryKey: ["events", eventId],
        queryFn: eventId ? () => fetchEvent(eventId) : skipToken
    })

    const [showSummary, setShowSummary] = useState(false)

    return (
        <div className="max-w-6xl mx-auto px-4">
            {isPending && (
                <div className="py-4 flex justify-center">
                    <Spinner className="size-12 text-primary-purple"/>
                </div>
            )}
            {isError && (
                 <div className="flex justify-center">
                    <div>
                        <Alert variant={"destructive"}>
                            <AlertCircleIcon />
                            <AlertTitle>Error fetching event data</AlertTitle>
                        </Alert>
                    </div>
                </div>
            )}
            {event && (
                <>
                    <div className="w-full md:h-[500px] overflow-hidden rounded-lg">
                        <img 
                            src={event.imageUrl || "https://placehold.co/1600?text=No+Image"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4 flex justify-between max-md:flex-col gap-4">
                        <div className="space-y-4">
                            <h1 className="text-3xl max-md:text-lg font-bold">{event.title}</h1>

                            <div className="flex items-center space-x-4 h-5 mt-2">
                                <div className="text-muted-foreground flex items-center gap-1">
                                    <CalendarDays className="size-5 text-muted-foreground"/>
                                    {format(new Date(event.startDate), "MMMM dd")}
                                </div>
                                <Separator orientation="vertical"/>
                            </div>

                            <p className="text-lg max-md:text-sm font-semibold">
                                Location: <span className="text-muted-foreground text-base">{event.location}</span>
                            </p>

                            <div className="flex items-center gap-2 h-5">
                                <div>
                                    Total tickets: <span className="text-muted-foreground">{event.totalTickets}</span>
                                </div>
                                <Separator orientation="vertical"/>
                                <div>
                                    Sold tickets: <span className="text-muted-foreground">{event.soldTickets}</span>
                                </div>
                                <Separator orientation="vertical"/>
                                <div>
                                    Available tickets: <span className="text-muted-foreground">{event.totalTickets - event.soldTickets}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h2 className="font-semibold text-lg">Description</h2>
                                <p className="text-muted-foreground">{event.description}</p>
                            </div>

                            {!showSummary && (
                                <Button onClick={() => setShowSummary(true)} className="bg-primary-purple hover:bg-primary-purple/90 cursor-pointer">
                                    Buy Tickets
                                </Button>
                            )}
                        </div>

                        <div className="md:max-w-xs lg:max-w-md w-full">
                            {showSummary && (
                                <TicketSummary event={event}/>
                            )}
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
export default EventDetailsPage