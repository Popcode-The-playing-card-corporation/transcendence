export type friendT = {
	id: number;
	user: {
		id: number;
		username: string;
		is_online: boolean;
	};
	status: string;
	accepted_at: string;
	created_at: string;
	can_accept: boolean;
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
		is_online: false,
	},
	status: "",
	accepted_at: "",
	created_at: "",
	can_accept: false,
}