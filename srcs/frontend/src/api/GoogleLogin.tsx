import host from "./host";

const GoogleLogin = () => {
	const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
	const REDIRECT_URI = 'login/google/';
	const GOOGLE_OAUTH2_CLIENT_ID =  "294113818614-nl7qotagp6f7o3u6550d742q3aq11l59.apps.googleusercontent.com"//should be in ENV!!!

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

    const params = {
    response_type: 'code',
    client_id: GOOGLE_OAUTH2_CLIENT_ID,
    redirect_uri: `${host.host_ip}/${REDIRECT_URI}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope
  };

  const urlParams = new URLSearchParams(params).toString();
  window.location.href = `${GOOGLE_AUTH_URL}?${urlParams}`;
};

export function Google_login(){
  return <button onClick={GoogleLogin}> Google Login</button>
}
