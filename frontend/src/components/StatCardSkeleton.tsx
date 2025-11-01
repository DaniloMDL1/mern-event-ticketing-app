import { Skeleton } from "./ui/skeleton"

const StatCardSkeleton = () => {
    return (
        <div className="md:max-w-60 h-[92px] w-full p-4 bg-card rounded-lg shadow-md flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20"/>
                <Skeleton className="h-4 w-10"/>
            </div>
            <Skeleton className="size-8"/>
        </div>
    )
}
export default StatCardSkeleton