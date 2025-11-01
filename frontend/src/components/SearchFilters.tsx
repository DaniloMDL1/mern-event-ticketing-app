import { CATEGORIES } from "@/utils/categories"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { Button } from "./ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useSearchParams } from "react-router"
import { useEffect, useState, type KeyboardEvent } from "react"

const SearchFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [sort, setSort] = useState("")

    const selectedCategories = searchParams.get("selectedCategories")?.split(",") || []

    useEffect(() => {
        setSort(searchParams.get("sortBy") || "")
    }, [searchParams])
    
    const handleSearchChange = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            const value = e.currentTarget.value
            
            const newParams = { ...Object.fromEntries(searchParams.entries()), search: value }
            setSearchParams(newParams)
        }
    }

    const handleSortChange = (value: string) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), sortBy: value }
        setSearchParams(newParams)
    }

    const handleCategoryChange = (category: string) => {
        let updatedSelectedCategories

        if(selectedCategories.includes(category)) {
            updatedSelectedCategories = selectedCategories.filter((c) => c !== category)
        } else {
            updatedSelectedCategories = [...selectedCategories, category]
        }

        const newParams = { ...Object.fromEntries(searchParams.entries()), selectedCategories: updatedSelectedCategories.join(","), page: "1" }
        setSearchParams(newParams)
    }

    const handleClearFilters = () => {
        const newParams = { ...Object.fromEntries(searchParams.entries()) }
        delete newParams.search
        delete newParams.selectedCategories
        delete newParams.sortBy

        setSearchParams(newParams)
    }

    return (
        <div className="space-y-6">
            <div className="px-11">
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                        {CATEGORIES.map((category, index) => {
                            const isCategorySelected = selectedCategories.includes(category.value)

                            return (
                                <CarouselItem key={index} className="basis-auto">
                                    <Button 
                                        onClick={() => handleCategoryChange(category.value)} 
                                        variant={isCategorySelected ? "default" : "outline"} 
                                        className="rounded-full py-6 bg-primary-purple text-white border-primary-purple hover:bg-primary-purple/90 cursor-pointer"
                                    >
                                        {category.label}
                                    </Button>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>

            <div className="flex gap-4 items-center">
                <div>
                    <InputGroup>
                        <InputGroupInput onKeyDown={handleSearchChange} placeholder="Search by title or location"/>
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                
                <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Date (soonest → latest)</SelectItem>
                        <SelectItem value="price">Price (low → high)</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={handleClearFilters} className="bg-primary-purple hover:bg-primary-purple/90 cursor-pointer">
                    Clear Filters
                </Button>
            </div>
        </div>
    )
}
export default SearchFilters