import type { EventType } from "@/types/event"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Minus, Plus } from "lucide-react"
import { Separator } from "@radix-ui/react-select"
import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { useLocation, useNavigate } from "react-router"
import CheckoutDialog from "./CheckoutDialog"

type Props = {
    event: EventType
}

const TicketSummary = ({ event }: Props) => {
    const [quantity, setQuantity] = useState(0)

    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const totalPrice = ((event.price * quantity) / 100).toFixed(2)

    const availableTickets = event.totalTickets - event.soldTickets

    const incrementQuantity = () => {
        if(quantity < availableTickets) {
            setQuantity((prev) => prev + 1)
        }
    }

    const decrementQuantity = () => {
        if(quantity > 0) {
            setQuantity((prev) => prev - 1)
        }
    }

    const { user } = useAuthContext()

    const isSoldOut = availableTickets === 0

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
                <CardDescription>Select the number of tickets to purchase</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between border p-4 rounded-lg">
                    <span className="text-muted-foreground font-medium">Ticket Price</span>
                    <span>${(event.price / 100).toFixed(2)}</span>
                </div>

                <div className="flex flex-col mt-4 rounded-lg border p-4">
                    <div className="flex items-center gap-1">
                        <div className="w-20 h-24 rounded-lg overflow-hidden">
                            <img src={event.imageUrl} className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-medium">{event.title}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex justify-between items-center gap-2 border p-2 rounded-lg w-30">
                            <Button onClick={decrementQuantity} disabled={quantity === 0} variant={"outline"} className="size-6">
                                <Minus />
                            </Button>
                            <span>{quantity}</span>
                            <Button onClick={incrementQuantity} disabled={quantity === availableTickets} variant={"outline"} className="size-6">
                                <Plus />
                            </Button>
                        </div>

                        <span>${totalPrice}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full border p-4 rounded-lg space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Total</span>
                        <span className="">${totalPrice}</span>
                    </div>
                    <Separator />
                    <Button  
                        onClick={() => {
                            if(user) {
                                setIsOpen(true)
                            } else {
                                navigate("/signin", { state: { from: location }})
                            }
                        }}
                        className="bg-primary-purple hover:bg-primary-purple/90 w-full py-6 cursor-pointer"
                    >
                        {user ? "Buy Tickets" : "Log In to Buy Tickets"}
                    </Button>
                    <CheckoutDialog 
                        isOpen={isOpen} 
                        setIsOpen={setIsOpen} 
                        isSoldOut={isSoldOut}
                        quantity={quantity}
                        event={event}
                    />
                </div>
            </CardFooter>
        </Card>
    )
}
export default TicketSummary