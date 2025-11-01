import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import type { SafeUserType } from "@/types/user"
import { useEffect } from "react"

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    location: z.string().optional()
})

export type UserProfileFormDataType = z.infer<typeof formSchema>

type Props = {
    onSubmit: (formData: UserProfileFormDataType) => void,
    isPending: boolean,
    user?: SafeUserType | null
}

const UserProfileForm = ({ onSubmit, isPending, user }: Props) => {

    const form = useForm<UserProfileFormDataType>({
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

                <Button type="submit" disabled={isPending} className="bg-primary-purple hover:bg-primary-purple/90 w-full">
                    {isPending ? <Spinner className="size-6 text-white"/> : "Update Profile"}
                </Button>
            </form>
        </Form>
    )
}
export default UserProfileForm