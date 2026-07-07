import { createContext, } from "react";
import type { AuthContextType } from "./AuthContext";

function getPreferedTheme() {
  if (window.matchMedia('(prefers-color-sheme: dark)'))
    return ("popcode_dark");
  else
    return ("popcode_light");
}

export const authContext = createContext<AuthContextType>({
	logged_in: false,
	logging: false,
	checking: true,
	in_game: false,
	userID: null,
	has_pass: true,
	hasFriendRequest: false,
	theme: getPreferedTheme(),
	setPass: () => { },
	setGame: () => { },
	setLogging: () => { },
	setLoggedIn: () => { },
	setUserID: () => { },
	setHasFriendRequest: () => { },
	setTheme: () => {},
});
