import useWebSocketModule from "react-use-websocket";

import host from '../api/host';

export function Presence() {

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
		default: typeof useWebSocketModule;
	};
	
	useWebSocket(host.ws + "presence/", {
		shouldReconnect: () => true,
		
		heartbeat: {
			message: JSON.stringify({ type: "heartbeat" }),
			returnMessage: JSON.stringify({ type: "acknowledge" }),
			interval: 30000,
			timeout: 60000,
		},

		onOpen: () => {
			console.log("Presence websocket connected");
		},

		onClose: () => {
			console.log("Presence websocket disconnected");
		},

		onMessage: (event) => {
			console.log("Presence message: ", event.data);
		},
	});
	return null;
}