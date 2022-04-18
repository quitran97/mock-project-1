export interface TodosProp {
    todos: Todos[],
    filterChange: string
}

export interface Todos {
    id : number,
    body : string,
    isCompleted : boolean
}