export type friendT = {
	id: number;
	user: {
		id: number;
		username: string;
		avatar: string;
		is_online: boolean;
	};
	status: string;
	accepted_at: string;
	created_at: string;
	can_accept: boolean;
	blocked_by: number;
	blocked_at: string;
};


export type requestT = {
	id: number;
	username: string;
}

export const defaultFriend:friendT = {
	id: 0,
	user: {
		id: 0,
		username: "",
		avatar: "",
		is_online: false,
	},
	status: "",
	accepted_at: "",
	created_at: "",
	can_accept: false,
	blocked_by: 0,
	blocked_at: "",
}