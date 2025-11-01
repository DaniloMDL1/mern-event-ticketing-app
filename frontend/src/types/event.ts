export type EventType = {
    _id: string,
    createdBy: string,
    title: string,
    description: string,
    category: string,
    imageUrl?: string,
    location: string,
    startDate: Date,
    endDate: Date,
    price: number,
    totalTickets: number,
    soldTickets: number,
    createdAt: Date,
    updatedAt: Date
}