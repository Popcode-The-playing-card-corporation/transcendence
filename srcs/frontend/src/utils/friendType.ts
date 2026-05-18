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