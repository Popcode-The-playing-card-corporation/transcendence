import GameVisual from "./GameVisual"
import Interface from "./Interface"

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
