import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { useAuthContext } from "@/context/AuthContext"
import type { SafeUserType, SignInPayloadType } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { z } from "zod"

const formSchema = z.object({
    email: z.email({ error: "Invalid email address"}),
    password: z.string().min(1, "Password is required")
})

type SignInFormDataType = z.infer<typeof formSchema>

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<SignInFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const navigate = useNavigate()
    const location = useLocation()

    const { setUserInfo } = useAuthContext()

    const { mutate: signInUser, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, SignInPayloadType>({
        mutationFn: async (signInFormData) => {
            const response = await axios.post("/api/users/signin", signInFormData)
            return response.data
        },
        onSuccess: (data) => {
            setUserInfo(data)
            toast.success("Signed in successfully")

            const redirectTo = location?.state?.from?.pathname || "/"
            navigate(redirectTo, { replace: true })
        },
        onError: (error) => {
            toast.error(error?.response?.data.message)
        }
    })

    const handleSignIn = async (signInFormData: SignInFormDataType) => {
        signInUser(signInFormData)
    }

    return (
        <div className="h-[calc(100vh-160px)] flex justify-center items-center">
            <div className="max-w-md w-full bg-card p-4 rounded-lg">
                <h1 className="mb-4 text-lg font-semibold text-center">Sign In to Your Account</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignIn)} autoComplete="off" className="space-y-6 mb-2">
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
                                        <InputGroup>
                                            <InputGroupInput 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="Password" 
                                                {...field}
                                            />
                                            <InputGroupAddon onClick={() => setShowPassword(!showPassword)} align={"inline-end"} className="cursor-pointer">
                                                {showPassword ? <Eye /> : <EyeOff />}
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending} className="bg-primary-purple hover:bg-primary-purple/90 w-full">
                            {isPending ? <Spinner className="text-white size-6"/> : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <Link className="text-sm hover:text-primary-purple hover:underline" to={"/signup"}>
                    Don't have an account? Sign Up
                </Link>
            </div>
        </div>
    )
}
export default SignInPage