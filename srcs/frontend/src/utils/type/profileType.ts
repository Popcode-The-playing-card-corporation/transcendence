
  type friendSimple = {
	id: number,
	status: string,
	created_at: string,
  }

  export type profileT = {
    id: number,
    username: string,
    avatar: string,
    date_joined: string,
    is_online: boolean,
    last_login: string,
    elo: number,
    friend: friendSimple,
	blocked_by_me: boolean,
  };

  export const defaultAccount:profileT  = {
	id: 0,
	username: "",
	avatar:"",
	date_joined:"",
	is_online:false,
	last_login:"",
	elo:0,
	friend: {id: 0, status: "nope", created_at: "nope nope"},
	blocked_by_me: false,
  }
