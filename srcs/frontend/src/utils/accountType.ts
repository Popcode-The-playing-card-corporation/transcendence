
  export type accountT = {
    id: number,
    username: string,
    email: string,
    avatar: string,
    date_joined: string,
    is_online: boolean,
    last_login: string,
    elo: number,
    is_friend: boolean,
	has_pass:boolean,
  };

  export const defaultAccount:accountT  = {
	id: 0,
	username: "",
	email:"",
	avatar:"",
	date_joined:"",
	is_online:false,
	last_login:"",
	elo:0,
	is_friend:false,
	has_pass:true,
  }
