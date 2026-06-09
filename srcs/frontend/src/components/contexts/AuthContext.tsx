import { useEffect, useState, type SetStateAction } from "react";
import { authContext } from "./CreateAuthContext"
import { checkAuth } from "../../api/http/checkAuth";

export interface AuthContextType {
	logged_in: boolean;
	logging: boolean;
	checking: boolean;
	in_game: boolean;
	userID: number | null;
	setUserID: React.Dispatch<SetStateAction<number | null>>;
	setGame: React.Dispatch<SetStateAction<boolean>>
	setLogging: React.Dispatch<SetStateAction<boolean>>
	setLoggedIn: React.Dispatch<SetStateAction<boolean>>
}

export default function AuthProvider ({children}:{children:React.ReactNode}) {

	const [logged_in, setLoggedIn] = useState<boolean>(false);
	const [logging, setLogging] = useState(true);
	const [checking, setChecking] = useState(true);
	const [in_game, setGame] = useState(false);
	const [userID, setUserID] = useState<number | null>(null);


	useEffect(() => {
		async function getAuth() {
			const auth = await checkAuth(setUserID)
			setLoggedIn(auth);
			setChecking(false);
			setLogging(false);


		}
		getAuth();

	}, [])

	return (
		<authContext.Provider value={{logged_in, logging, checking, in_game, userID, setGame, setLogging, setLoggedIn, setUserID}}>{children}</authContext.Provider>
	)
}