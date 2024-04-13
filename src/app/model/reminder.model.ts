import { Tag } from "./tag.model"

export interface Reminder {
    id: number
    title: string
    description: string
    dueDate: Date
    completed: boolean
    tags: Tag[] | null
}