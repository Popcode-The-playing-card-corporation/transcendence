import { createContext, useContext } from "react";
import type { GameState } from "./GameType"

type GameContextT = {
	state: GameState;
	sendParams: (params: object) => void;
	nextGame: (new_code: string) => void;
	leaveRoom: () => void;
	startGame: () => void;
	exitGame: () => void;
	playCard: (cardId: number) => void;
	continueGame: () => void;
	endGame: () => void;
	annonces: (cards: { cardId: number }[]) => void;
	kickPlayer: (playerId: number) => void;
	setMode: (mode: number) => void;
	setSize: (size: number) => void;
	setGoal: (goal: string) => void;
	setNBGames: (games: number) => void;
	setNBPoints: (points: number) => void;
	sendMessage: (action: string, message: string) => void;
	setWait: (bool: boolean) => void;
	show_annonces: () => void;
}

export const GameContext = createContext<GameContextT | null>(null);

export function useGame() {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error(
			"context is null"
		);
	}
	return context;
}
