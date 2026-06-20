export type chatT = {
    type: string;
    user: {
        id: number;
        username: string;
        avatar: string;
    };
    message: string;
    time: string;
}

export const defaultChat: chatT = {
    type: "message",
    user: {
		id: 0,
		username: "",
		avatar: "",
	},
    time: "",
    message: ""
}