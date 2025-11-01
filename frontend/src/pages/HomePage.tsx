import EventCard from "@/components/EventCard"
import EventCardSkeleton from "@/components/EventCardSkeleton"
import Hero from "@/components/Hero"
import SearchFilters from "@/components/SearchFilters"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { EventType } from "@/types/event"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon } from "lucide-react"
import { useSearchParams } from "react-router"

type FetchEventsType = {
    events: EventType[],
    pagination: {
        totalEvents: number,
        totalPages: number,
        page: number
    }
}

const fetchEvents = async (params = {}): Promise<FetchEventsType> => {
    const queryString = new URLSearchParams(params).toString()
    const response = await axios.get(`/api/events?${queryString}`)
    return response.data
}

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "date"
    const selectedCategories = searchParams.get("selectedCategories") || ""
    const page = Number(searchParams.get("page")) || 1

    const { data, isPending, isError } = useQuery({
        queryKey: ["events", page, search, sortBy, selectedCategories],
        queryFn: () => fetchEvents({ page, search, sortBy, selectedCategories })
    })

    const handlePageChange = (page: number) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), page: page.toString() }
        setSearchParams(newParams)
        window.scrollTo({ behavior: "smooth", top: 0 })
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            <Hero />
            
            <div className="mt-6">
                <SearchFilters />
            </div>

            <div className="mt-6">
                {isPending && (
                    <div className="grid lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] max-lg:grid-cols-3 max-md:grid-cols-2 gap-3 gap-y-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <EventCardSkeleton key={index}/>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex justify-center">
                        <div>
                            <Alert variant={"destructive"}>
                                <AlertCircleIcon />
                                <AlertTitle>Error fetching events data</AlertTitle>
                            </Alert>
                        </div>
                    </div>
                )}

                {!isPending && !isError && data && (
                    <>
                        <div className="grid lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] max-lg:grid-cols-3 max-md:grid-cols-2 gap-3 gap-y-6">  
                            {data.events.map((event) => (
                                <EventCard key={event._id} event={event}/>
                            ))}
                        </div>

                        {data.pagination.totalPages > 1 && (
                            <div className="mt-4 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem className="cursor-pointer">
                                            <PaginationPrevious onClick={() => page > 1 && handlePageChange(page - 1)}/>
                                        </PaginationItem>

                                        {Array.from({ length: data.pagination.totalPages }).map((_, index) => (
                                            <PaginationItem key={index} className="cursor-pointer">
                                                <PaginationLink isActive={page === index + 1} onClick={() => handlePageChange(index + 1)}>
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem className="cursor-pointer">
                                            <PaginationNext onClick={() => page < data.pagination.totalPages && handlePageChange(page + 1)}/>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}


            </div>

        </div>
    )
}
export default HomePage