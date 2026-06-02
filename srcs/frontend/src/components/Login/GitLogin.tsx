import { FaGithub } from "react-icons/fa";

const CLIENT_ID = import.meta.env.VITE_GIT_OAUTH_CLIENT_ID
const GIT_URL = "https://github.com/login/oauth/authorize?";
const CALLBACK = import.meta.env.VITE_GIT_OAUTH_CALLBACK_URL; // should come from env

export function GitLogin({location}:{location:string}) {
	function handleGit() {
		const param = new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: CALLBACK,
			response_type: "code",
			scope: "user:email"
		});
		sessionStorage.setItem('login_redirect', location);
		window.location.href = GIT_URL + param.toString();
	}
	return ( <button className="btn " onClick={handleGit}> <FaGithub /> </button>);
}
