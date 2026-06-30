import { useEffect, useState, type SetStateAction } from "react";
import { authContext } from "./CreateAuthContext"
import { checkAuth } from "../../api/http/checkAuth";

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
			setHasFriendRequest(false);
		}
		getAuth();

	}, [])

	return (
		<authContext.Provider value={{ logged_in, logging, checking, in_game, userID, hasFriendRequest, has_pass, setPass, setGame, setLogging, setLoggedIn, setUserID, setHasFriendRequest }}>{children}</authContext.Provider>
	)
}