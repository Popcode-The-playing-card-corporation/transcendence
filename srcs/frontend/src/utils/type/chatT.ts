export type chatT = {
    id: number,
    username: string,
    time: string,
    message: string
}

export const defaultChat: chatT = {
    id: 0,
    username: "",
    time: "",
    message: ""
}