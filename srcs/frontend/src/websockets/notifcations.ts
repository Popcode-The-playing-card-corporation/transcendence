import useWebSocketModule from "react-use-websocket";

import host from '../api/host';
import { useNotif } from "../components/hooks/useNotif";

export function Notifications() {

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
		default: typeof useWebSocketModule;
	};

	const notif = useNotif();
	
	useWebSocket(host.ws + "notification/", {
		shouldReconnect: () => true,
		
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
			const data = JSON.parse(event.data);
			const payload = data.payload;
			if (data.event === "notification") {
				if (data.type === "friend_request") {
					notif?.showNotif("New Friend Request", payload.from_user + " has sent you a friend request!", 5000);
				} else if (data.type === "friend_accepted") {
					notif?.showNotif("Friend Request Accepted", payload.from_user + " has accepted your friend request!", 5000);
				} else {
					console.debug("type not implemented. Format: ", data)
				}
			} else if (data.event === "update") {
				console.debug("Refresh target");
			} else {
				console.debug("event not implemented. Format: ", data)
			}	
		},
	});
	return null;
}

//event not implemented. Format:  {"type": "friend_accepted", "event": "notification", "payload": {"message": "anouar accept your friend request"}}
//event not implemented. Format:  {"type": "friend_request", "event": "notification", "payload": {"from_user": "test", "from_user_id": 9, "message": "test sent you a friend request"}}