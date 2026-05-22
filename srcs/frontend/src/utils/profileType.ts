
  export type profileT = {
    id: number,
    username: string,
    avatar: string,
    date_joined: string,
    is_online: boolean,
    last_login: string,
    elo: number,
    is_friend: boolean,
  };

  export const defaultAccount:profileT  = {
	id: 0,
	username: "",
	avatar:"",
	date_joined:"",
	is_online:false,
	last_login:"",
	elo:0,
	is_friend:false,
  }
