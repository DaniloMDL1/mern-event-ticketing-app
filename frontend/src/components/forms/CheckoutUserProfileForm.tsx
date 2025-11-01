import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect } from "react"
import { Spinner } from "../ui/spinner"

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
    location: z.string().min(1, "Location is required")
})

export type CheckoutUserProfileFormDataType = z.infer<typeof formSchema>

type Props = {
    isSoldOut: boolean,
    onSubmit: (formData: CheckoutUserProfileFormDataType) => void,
    isPending: boolean,
    quantity: number
}

const CheckoutUserProfileForm = ({ isSoldOut, onSubmit, isPending, quantity }: Props) => {
    const { user } = useAuthContext()

    const form = useForm<CheckoutUserProfileFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            location: ""
        }
    })

    useEffect(() => {
        if(user) {
            form.reset({
                username: user.username,
                email: user.email,
                password: "",
                location: user.location
            })
        }
    }, [user])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
                <FormField 
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Email Address" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Location" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSoldOut || isPending || quantity === 0} className="bg-primary-purple hover:bg-primary-purple/90 w-full">
                    {isSoldOut ? "Sold Out" : isPending ? <Spinner className="text-white size-6"/> : "Buy tickets"}
                </Button>
            </form>
        </Form>
    )
}
export default CheckoutUserProfileForm