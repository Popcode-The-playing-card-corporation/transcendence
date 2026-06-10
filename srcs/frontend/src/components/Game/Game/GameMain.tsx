import type { boardDataT } from "../../../utils/type/boardDataType";
import GameVisual from "./GameVisual"
import Interface from "./Interface"

type Props = {
	board_data: boardDataT;
	playCard: (cardId: number) => void;
	annonces: (cards: number[]) => void;
	continueGame: () => void;
	endGame: () => void;
}

export default function  GameMain({board_data, playCard, annonces, continueGame, endGame} : Props) {
	
	return (
		<div className="w-sceen h-screen flex">
		<GameVisual />
		<Interface />
		</div>
		
	)
}
