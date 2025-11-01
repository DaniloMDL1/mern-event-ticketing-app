import type { EventType } from "@/types/event"
import CheckoutUserProfileForm, { type CheckoutUserProfileFormDataType } from "./forms/CheckoutUserProfileForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

type CreateCheckoutSessionPayloadType = {
    eventId: string,
    userInformation: {
        username: string,
        email: string,
        password: string,
        location: string
    },
    quantity: string
}

type Props = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isSoldOut: boolean,
    quantity: number,
    event: EventType
}

const CheckoutDialog = ({ isOpen, setIsOpen, isSoldOut, quantity, event }: Props) => {

    const { mutate: createCheckoutSession, isPending } = useMutation<{ url: string }, AxiosError<{ message: string }>, CreateCheckoutSessionPayloadType>({
        mutationFn: async (formData) => {
            const response = await axios.post("/api/tickets/create-checkout-session", formData)
            return response.data
        },
        onSuccess: (data) => {
            window.location.href = data.url
        },
        onError: (error) => {
            toast.error(error.response?.data.message)
        }
    })

    const handleCheckout = (checkoutUserProfileFormData: CheckoutUserProfileFormDataType) => {
        createCheckoutSession({
            eventId: event._id.toString(),
            userInformation: checkoutUserProfileFormData,
            quantity: quantity.toString()
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Checkout Details</DialogTitle>
                    <DialogDescription>Please enter your information to complete your ticket purchase.</DialogDescription>
                </DialogHeader>
                <CheckoutUserProfileForm isSoldOut={isSoldOut} onSubmit={handleCheckout} isPending={isPending} quantity={quantity}/>
            </DialogContent>
        </Dialog>
    )
}
export default CheckoutDialog