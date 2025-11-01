import type { LucideProps } from "lucide-react"

type Props = {
    title: string,
    value: number | string,
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const StatCard = ({ title, value, Icon }: Props) => {
    return (
        <div className="md:max-w-60 w-full p-4 bg-card rounded-lg shadow-md flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <h3>{title}</h3>
                <p className="text-xl font-medium">{title === "Total Revenue" && "$"}{value}</p>
            </div>
            <Icon className=""/>
        </div>
    )
}
export default StatCard