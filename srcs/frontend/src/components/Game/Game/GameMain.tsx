import type React from "react"
import GameVisual from "./GameVisual"
import Interface from "./Interface"
import type { SetStateAction } from "react"

type Props = {
	playCard: (cardId: number) => void;
	annonces: (cards: number[]) => void;
	continueGame: () => void;
	endGame: () => void;
}

export default function  GameMain({playCard, annonces, continueGame, endGame} : Props) {
	
	return (
		<div className="w-sceen h-screen flex">
		<GameVisual />
		<Interface />
		</div>
		
	)
}
