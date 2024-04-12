export interface Note {
    title: string
    description: string
    dueDate?: Date | null
    completed: boolean
    tags: string[]
}