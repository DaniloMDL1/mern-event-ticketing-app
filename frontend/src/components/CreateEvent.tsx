import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CATEGORIES } from "@/utils/categories"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import type { EventType } from "@/types/event"
import type { AxiosError } from "axios"
import axios from "axios"
import { toast } from "react-toastify"
import { Spinner } from "./ui/spinner"
import { useNavigate } from "react-router"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Category is required"),
    startDate: z.date({ error: "Start date is required"}),
    endDate: z.date({ error: "End date is required"}),
    price: z.coerce.number<number>({ error: "Price must be a number" }).gt(0, "Price must be a positive number"),
    totalTickets: z.coerce.number<number>({ error: "Total tickets must be a number" }).gt(0, "Total tickets must be a positive number"),
    imageFile: z.instanceof(File, { error: "Image must be a file"}).optional()
})

type CreateEventFormDataType = z.infer<typeof formSchema>

const CreateEvent = () => {

    const form = useForm<CreateEventFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            location: "",
            price: 10,
            totalTickets: 10
        }
    })

    const navigate = useNavigate()

    const imageFile = form.watch("imageFile")

    const [img, setImg] = useState<string | null>(null)

    useEffect(() => {
        if(imageFile) {
            const newUrl = URL.createObjectURL(imageFile)
            
            setImg(newUrl)
        }
    }, [imageFile])

    const { mutate: createEvent, isPending } = useMutation<EventType, AxiosError<{ message: string }>, FormData>({
        mutationFn: async (formData) => {
            const response = await axios.post("/api/admin/event", formData)
            return response.data
        },
        onSuccess: (data) => {
            form.reset()
            setImg(null)

            toast.success("Event has been created successfully")

            navigate(`/events/${data._id}`)

        },
        onError: (error) => {
            toast.error(error?.response?.data.message)
        }
    })

    const handleCreateEvent = (createEventFormData: CreateEventFormDataType) => {
        const formData = new FormData()

        formData.append("title", createEventFormData.title)
        formData.append("description", createEventFormData.description)
        formData.append("category", createEventFormData.category)
        formData.append("location", createEventFormData.location)

        formData.append("startDate", new Date(createEventFormData.startDate).toISOString())
        formData.append("endDate", new Date(createEventFormData.endDate).toISOString())

        formData.append("price", (createEventFormData.price * 100).toString())
        formData.append("totalTickets", createEventFormData.totalTickets.toString())

        if(createEventFormData.imageFile) {
            formData.append("imageFile", createEventFormData.imageFile)
        }

        createEvent(formData)

    }

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-xl font-semibold">Create New Event</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateEvent)} autoComplete="off" className="mt-10 space-y-6">
                    
                    <div className="flex gap-4 max-md:flex-col">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Location" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category for the event"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CATEGORIES.map((category, index) => (
                                            <SelectItem key={index} value={category.value}>{category.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 max-md:flex-col">
                        <FormField 
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"}>
                                                    {field.value ? (
                                                        format(field.value, "PP")
                                                    ) : (
                                                        <span>Pick a start date</span>
                                                    )}
                                                    <CalendarIcon />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar 
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"}>
                                                    {field.value ? (
                                                        format(field.value, "PP")
                                                    ) : (
                                                        <span>Pick a end date</span>
                                                    )}
                                                    <CalendarIcon />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar 
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date() || date < form.getValues("startDate")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-4 max-md:flex-col">
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Price" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="totalTickets"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Tickets</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Total Tickets" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField 
                        control={form.control}
                        name="imageFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Image</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file"
                                        accept=".jpg, jpeg, .png"
                                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {img && (
                        <div className="mt-4">
                            <div className="md:w-3/5 rounded-lg overflow-hidden">
                                <img src={img} className="w-full h-full object-cover"/>
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={isPending} className="bg-primary-purple hover:bg-primary-purple/90 cursor-pointer w-[120px]">
                        {isPending ? <Spinner className="text-white size-6"/> : "Create Event"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
export default CreateEvent