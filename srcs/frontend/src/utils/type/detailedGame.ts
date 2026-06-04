import type { userInGameT } from "./userInGameType"

export type detailedRoundT = {
	players: userInGameT[]
}

export type detailedGameT = {
	rounds: detailedRoundT[],
	is_finished: boolean,
	total: userInGameT[],
}
