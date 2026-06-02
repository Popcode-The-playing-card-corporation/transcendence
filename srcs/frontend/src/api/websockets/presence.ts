import useWebSocketModule from "react-use-websocket";

import host from '../http/host';

export function Presence({loggedIn}:{loggedIn: boolean}) {

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
		default: typeof useWebSocketModule;
	};
	

	useWebSocket(loggedIn ? (host.ws + "presence/") : null, {
		shouldReconnect: () => loggedIn,
		reconnectAttempts: 30,
		reconnectInterval: 1000,

		heartbeat: {
			message: JSON.stringify({ type: "heartbeat" }),
			returnMessage: JSON.stringify({ type: "acknowledge" }),
			interval: 30000,
			timeout: 60000,
		},

		onOpen: () => {
		
		},

		onClose: () => {

		},

		onMessage: (event) => {
			console.log("Presence message: ", event.data);
		},
	});
	return null;
}