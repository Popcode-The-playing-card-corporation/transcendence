import { createContext } from "react";
import type { AuthContextType } from "./AuthContext";

export const authContext = createContext<AuthContextType>({
    logged_in: false,
    logging: false,
	checking:true,
	in_game:false,
    setGame: () => {},
    setLogging: () => {},
	setLoggedIn: () => {},
});
