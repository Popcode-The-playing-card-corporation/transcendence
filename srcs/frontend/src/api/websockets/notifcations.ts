import useWebSocketModule from "react-use-websocket";

import host from '../http/host';
import { useNotif } from "../../components/hooks/useNotif";
import type { SetStateAction } from "react";
import { useAuth } from "../../components/hooks/useAuth";
import type { friendT, requestT } from "../../utils/type/friendType";
import { friendArray, getFriends } from "../http/friend";
import type { AuthContextType } from "../../components/contexts/AuthContext";

function getRequests(friend_list: friendT[]): {
	friends: friendT[];
	requests: requestT[];
	} {
	const friends: friendT[] = [];
	const requests: requestT[] = [];

	for (const friend of friend_list) {
		if (friend.can_accept) {
		requests.push({ id: friend.id, username: friend.user.username });
		} else {
		friends.push(friend);
		}
	}
	return { friends: friends, requests: requests };
}

async function handle_update_profile(auth : AuthContextType, setProfile : React.Dispatch<SetStateAction<boolean>>, updatedProfile : boolean) {
	
	const friendlist = await getFriends();
	if ("code" in friendlist) {
		auth.setHasFriendRequest(false);
		return ;
	}
	const arr = friendArray(friendlist);
	const filter = getRequests(arr);
	if (filter.requests.length > 0) {
		auth.setHasFriendRequest(true);
	} else {
		auth.setHasFriendRequest(false);
	}
	setProfile(!updatedProfile);
}


type Props = {
	setProfile: React.Dispatch<SetStateAction<boolean>>;
	updatedProfile: boolean;
	updateLeaderboard: boolean;
	setLeaderboard: React.Dispatch<SetStateAction<boolean>>;
}

export function Notifications({ setProfile, updatedProfile, updateLeaderboard, setLeaderboard }: Props) {

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
		default: typeof useWebSocketModule;
	};
	const auth = useAuth();
	const notif = useNotif();

	useWebSocket(auth.logged_in ? (host.ws + "notification/") : null, {
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
			const data = JSON.parse(event.data);
			if (data.type == "acknowledge") {
				return
			}
			const payload = data.payload;
			if (data.event === "notification") {
				if (data.type === "friend_request") {
					notif?.showNotif("New Friend Request", payload.from_user + " has sent you a friend request!", 5000);
					handle_update_profile(auth, setProfile, updatedProfile);
				} else if (data.type === "friend_accepted") {
					notif?.showNotif("Friend Request Accepted", payload.from_user + " has accepted your friend request!", 5000);
					handle_update_profile(auth, setProfile, updatedProfile);
				} else if (data.type === "friend_invite") {
					notif?.showNotif("Game Invite", payload.from_user + " has invited you to a game: " + payload.code, 10000);
					handle_update_profile(auth, setProfile, updatedProfile);
				} else {
					console.debug("Notification: type not implemented. Format: ", data)
				}
			} else if (data.event === "update") {
				if (data.type === "friend_delete") {
					handle_update_profile(auth, setProfile, updatedProfile);
				} else if (data.type === "friend_block") {
					handle_update_profile(auth, setProfile, updatedProfile); // change to update blocklist once implemented
				} else if (data.type === "friend_online") {
					handle_update_profile(auth, setProfile, updatedProfile);
				} else if (data.type === "game_finished") {
					setLeaderboard(!updateLeaderboard);
				} else {
					console.debug("Update: type not implemented. Format: ", data)
				}
			} else {
				console.debug("event not implemented. Format: ", data)
			}
		},
	});
	return null;
}
