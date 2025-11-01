import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

const TicketItemSkeleton = () => {
    return (
        <div className="flex justify-between gap-3 p-4 border rounded-lg shadow-md bg-card">

            <div className="flex gap-3">

                <div className="">
                    <div className="w-28 h-32 max-md:h-full overflow-hidden rounded-lg">
                        <Skeleton className="w-full h-full"/>
                    </div>
                </div>

                <div className="">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-30"/>
                        <div className="flex items-center space-x-4 h-5 mt-2">
                            <Skeleton className="h-4 w-10"/>
                            <Separator orientation="vertical"/>
                            <Skeleton className="h-4 w-10"/>
                        </div>
                        <Skeleton className="h-4 w-20"/>
                        <div className="md:hidden">
                            <Skeleton className="h-4 w-[60px] mb-2"/>
                            <Skeleton className="h-4 w-10"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-md:hidden">
                <Skeleton className="h-4 w-[60px] mb-2"/>
                <Skeleton className="h-4 w-10"/>
            </div>
        </div>
    )
}
export default TicketItemSkeleton