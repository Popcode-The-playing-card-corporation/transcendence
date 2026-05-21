import { Si42 } from "react-icons/si";

const CLIENT_ID = import.meta.env.VITE_42_OAUTH_CLIENT_ID;
const FORTYTWO_URL = "https://api.intra.42.fr/oauth/authorize?";
const CALLBACK = import.meta.env.VITE_42_OAUTH_CALLBACK_URL; // should come from env

export function FortyTwoLogin() {
  function handleFortyTwo() {
    const param = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: CALLBACK,
      response_type: "code",
      scope: "public",
    });

    window.location.href = FORTYTWO_URL + param.toString();
  }
  return (
    <button className="btn " onClick={handleFortyTwo}>
      {" "}
      <Si42 />{" "}
    </button>
  );
}

