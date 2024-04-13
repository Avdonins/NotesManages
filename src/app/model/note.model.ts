import { Tag } from "./tag.model"

export interface Note {
    id: number
    title: string
    description: string
    dueDate?: Date | null
    completed: boolean
    tags: Tag[] | null
}