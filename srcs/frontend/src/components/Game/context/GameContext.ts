import { createContext, useContext } from "react";
import type { GameState } from "./GameType"

type GameContextT = {
	state: GameState;
	leaveRoom: () => void;
	startGame: () => void;
	playCard: (cardId: number) => void;
	continueGame: () => void;
	endGame: () => void;
	annonces: (cards: number[]) => void;
	kickPlayer: (playerId: number) => void;
	setMode: (mode: number) => void;
	setSize: (size: number) => void;
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