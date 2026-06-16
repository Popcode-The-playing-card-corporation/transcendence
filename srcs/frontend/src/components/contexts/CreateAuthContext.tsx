import { createContext } from "react";
import type { AuthContextType } from "./AuthContext";

export const authContext = createContext<AuthContextType>({
    logged_in: false,
    logging: false,
	checking:true,
    setLogging: () => {},
	setLoggedIn: () => {},
});
