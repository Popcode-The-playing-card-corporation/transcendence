import { useEffect, useState, type SetStateAction } from "react";
import { authContext } from "./CreateAuthContext"
import { checkAuth } from "../../api/http/checkAuth";

export interface AuthContextType {
	logged_in: boolean;
	logging: boolean;
	checking: boolean;
	in_game: boolean;
	setGame: React.Dispatch<SetStateAction<boolean>>
	setLogging: React.Dispatch<SetStateAction<boolean>>
	setLoggedIn: React.Dispatch<SetStateAction<boolean>>
}

export default function AuthProvider ({children}:{children:React.ReactNode}) {

	const [logged_in, setLoggedIn] = useState<boolean>(false);
	const [logging, setLogging] = useState(true);
	const [checking, setChecking] = useState(true);
	const [in_game, setGame] = useState(false);


	useEffect(() => {
		async function getAuth() {
			setLoggedIn(await checkAuth());
			setChecking(false);
			setLogging(false);
		}
		getAuth();
	}, [])

	return (
		<authContext.Provider value={{logged_in, logging, checking, in_game, setGame, setLogging, setLoggedIn}}>{children}</authContext.Provider>
	)
}