const CLIENT_ID = import.meta.env.VITE_GIT_OAUTH_CLIENT_ID
const GIT_URL = "https://github.com/login/oauth/authorize?";
const CALLBACK = import.meta.env.VITE_GIT_OAUTH_CALLBACK_URL; // should come from env

export function GitLogin() {
	function handleGit() {
		const param = new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: CALLBACK,
			response_type: "code",
			scope: "user:email"
		});

		window.location.href = GIT_URL + param.toString();
	}
	return ( <button onClick={handleGit}> Login with GitHub </button>);
}