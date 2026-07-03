import { useEffect, useState, type SetStateAction } from "react";
import { authContext } from "./CreateAuthContext"
import { checkAuth } from "../../api/http/checkAuth";
import { friendArray, getFriends } from "../../api/http/friend";
import type { friendT, requestT } from "../../utils/type/friendType";

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

export interface AuthContextType {
	logged_in: boolean;
	logging: boolean;
	checking: boolean;
	in_game: boolean;
	userID: number | null;
	has_pass: boolean;
	hasFriendRequest: boolean;
	setPass: React.Dispatch<SetStateAction<boolean>>;
	setUserID: React.Dispatch<SetStateAction<number | null>>;
	setGame: React.Dispatch<SetStateAction<boolean>>;
	setLogging: React.Dispatch<SetStateAction<boolean>>;
	setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
	setHasFriendRequest: React.Dispatch<SetStateAction<boolean>>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {

	const [logged_in, setLoggedIn] = useState<boolean>(false);
	const [logging, setLogging] = useState(true);
	const [checking, setChecking] = useState(true);
	const [in_game, setGame] = useState(false);
	const [userID, setUserID] = useState<number | null>(null);
	const [has_pass, setPass] = useState(true);
	const [hasFriendRequest, setHasFriendRequest] = useState<boolean>(false);


	useEffect(() => {
		async function getAuth() {
			const auth = await checkAuth(setUserID, setPass)
			setLoggedIn(auth);
			setChecking(false);
			setLogging(false);
			if (auth) {
				const friendlist = await getFriends();
				if ("code" in friendlist) {
					setHasFriendRequest(false);
					return ;
				}
				const arr = friendArray(friendlist);
				const filter = getRequests(arr);
				if (filter.requests.length > 0) {
					setHasFriendRequest(true);
				} else {
					setHasFriendRequest(false);
				}
			}
		}
		getAuth();

	}, [])

	return (
		<authContext.Provider value={{ logged_in, logging, checking, in_game, userID, hasFriendRequest, has_pass, setPass, setGame, setLogging, setLoggedIn, setUserID, setHasFriendRequest }}>{children}</authContext.Provider>
	)
}