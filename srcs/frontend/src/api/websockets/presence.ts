import useWebSocketModule from "react-use-websocket";

import host from '../http/host';
import { useAuth } from "../../components/hooks/useAuth";

export function Presence() {

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
		default: typeof useWebSocketModule;
	};
	const auth = useAuth();

	useWebSocket(auth.logged_in ? (host.ws + "presence/") : null, {
		shouldReconnect: () => auth.logged_in ? true : false,
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