import { FaGoogle } from "react-icons/fa";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
const GOOGLE_URL = "https://accounts.google.com/o/oauth2/v2/auth?";
const CALLBACK = import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URL; // should come from env

export function GoogleLogin({location}:{location:string}) {
	function handleGoogle() {
		const param = new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: CALLBACK,
			response_type: "code",
			scope: "openid email profile"
		});
		sessionStorage.setItem('login_redirect', location);
		window.location.href = GOOGLE_URL + param.toString();
	}
	return ( <button className="btn " onClick={handleGoogle}> <FaGoogle /> </button>);
}
