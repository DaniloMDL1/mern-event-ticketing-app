import { Card, CardContent, CardFooter } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const EventCardSkeleton = () => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="relative w-full h-[280px] rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute top-2 right-2">
                        <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                </div>

                <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
            </CardContent>

            <CardFooter>
                <Skeleton className="h-8 w-24 rounded-md" />
            </CardFooter>
        </Card>
    )
}
export default EventCardSkeleton