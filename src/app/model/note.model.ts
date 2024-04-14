import { Tag } from "./tag.model"

export interface Note {
    id: number
    title: string
    description: string
    tags: Tag[] | null
}