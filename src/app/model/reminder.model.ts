import { Tag } from "./tag.model"

export interface Reminder {
    id: number
    title: string
    description: string
    dueDate: Date
    time: string
    completed: boolean
    tags: Tag[] | null
}