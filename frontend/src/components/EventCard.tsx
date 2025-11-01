import { ArrowRight, CalendarDays } from "lucide-react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import type { EventType } from "@/types/event"
import { format } from "date-fns"
import { useNavigate } from "react-router"

type Props = {
    event: EventType
}

const EventCard = ({ event }: Props) => {
    const navigate = useNavigate()

    const isEventSoldOut = event.soldTickets >= event.totalTickets

    const formattedEventTitle = event.title.length > 80 ? event.title.substring(0, 80) + "..." : event.title

    return (
        <Card className="w-full">
            <CardContent>
                <div className="relative w-full">

                    <div className="relative w-full h-[280px] aspect-square overflow-hidden rounded-lg">
                        <img 
                            src={event.imageUrl || "https://placehold.co/1600?text=No+Image"} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {isEventSoldOut && (
                        <div className="absolute top-2 right-2">
                            <Badge variant={"destructive"} className="py-2 rounded-md shadow-md">Sold Out</Badge>
                        </div>
                    )}
                </div>
                <div className="mt-2 space-y-2">
                    <div className="text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="size-5"/>
                        <span className="text-sm font-medium">
                            {format(new Date(event.startDate), "MMMM dd")}
                        </span>
                    </div>
                    <h2 className="wrap-break-word tracking-tight text-sm font-semibold">
                        {formattedEventTitle}
                    </h2>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => navigate(`/events/${event._id}`)} variant={"ghost"} size={"sm"} className="cursor-pointer hover:text-primary-purple/90">
                    View More <ArrowRight />
                </Button>
            </CardFooter>
        </Card>
    )
}
export default EventCard