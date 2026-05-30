const API = import.meta.env.VITE_API_URL;
const WS =  import.meta.env.VITE_WS_URL;

function wsUrl(path: string) {

	if (path.startsWith("ws://")) {
		return path;
	}

	const protocol = window.location.protocol === "https:" ? "wss" : "ws";
	return (protocol + "://" + window.location.host + path);
}

export default {
	http: API,
	ws:  wsUrl(WS),
}
