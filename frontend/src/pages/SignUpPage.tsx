import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import type { SafeUserType, SignUpPayloadType } from "@/types/user"
import { useAuthContext } from "@/context/AuthContext"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "react-toastify"

const formSchema = z.object({
    username: z.string().min(1, "Name is required"),
    email: z.email({ error: "Invalid email address "}),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignUpFormDataType = z.infer<typeof formSchema>

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<SignUpFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const navigate = useNavigate()

    const { setUserInfo } = useAuthContext()

    const { mutate: signUpUser, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, SignUpPayloadType>({
        mutationFn: async (signUpFormData) => {
            const response = await axios.post("/api/users/signup", signUpFormData)
            return response.data
        },
        onSuccess: (data) => {
            setUserInfo(data)
            toast.success("Signed up successfully")
            navigate("/")
        },
        onError: (error) => {
            toast.error(error?.response?.data.message)
        }
    })

    const handleSignUp = async (signUpFormData: SignUpFormDataType) => {
        signUpUser(signUpFormData)
    }

    return (
        <div className="h-[calc(100vh-160px)] flex justify-center items-center">
            <div className="max-w-md w-full bg-card p-4 rounded-lg">
                <h1 className="mb-4 text-lg font-semibold text-center">Create an Account</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} autoComplete="off" className="space-y-6 mb-2">
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
                            {isPending ? <Spinner className="text-white size-6"/> : "Sign Up"}
                        </Button>
                    </form>
                </Form>

                <Link className="text-sm hover:text-primary-purple hover:underline" to={"/signin"}>
                    Already have an account? Sign In
                </Link>
            </div>
        </div>
    )
}
export default SignUpPage