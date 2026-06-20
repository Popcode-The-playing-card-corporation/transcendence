import AdversaryCard from "./AdversaryCard";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import type { Texture, TextureEventMap } from "three";
import React, { useEffect, useState, type SetStateAction } from "react";
import { useGame } from "../../context/GameContext";

type Props = {
  setShow: React.Dispatch<SetStateAction<boolean>>,
  angleCenter:number,
  cardHand: adversaryT, 
  fronts: Texture<HTMLImageElement, TextureEventMap>[],
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer:number,
  boardRadius: number,
  posPlayedCard: number
}

export default function AdversaryHand({setShow, angleCenter, cardHand, fronts, back, totalPlayer, boardRadius, posPlayedCard} : Props) {
  
  const [simCards, setCards] = useState(cardHand.nbCards);
  const [playedCard, setPlayed] = useState<number | null>(null);
  const { state } = useGame();
  const angleBetween = Math.PI / 30;
  const littleRadius = Math.sin(angleCenter / 2) * boardRadius;
  const angleStart = - (cardHand.nbCards - 1) * angleBetween / 2;
  const allAngle : number[] = [];


	useEffect(() => {
		function handle_less() {
			if (cardHand.nbCards < simCards && playedCard === null) {
				setPlayed(simCards - 1);
			}
		}
		handle_less();
	}, [cardHand.nbCards, simCards, playedCard]);

  for (let i = 0; i < simCards; i++)
    allAngle.push(angleStart + i * angleBetween);

  function resetState() {
	setCards(cardHand.nbCards);
	setPlayed(null);
  }



  return (
      <mesh
      >
        {allAngle.map((angle, index) => {

			const board = state.game.boardData.board.at(-1)
			let cardID = 0;
			if (board) {
				cardID = board.card.id;
			}
			
			if (index === playedCard) {
				setShow(false);
			}
          return (
            <>
              <AdversaryCard
			    setShow={setShow}
                angle={angle}
                littleRadius={littleRadius}
				front={fronts[cardID]}
                back={back}
                positionCard={allAngle.indexOf(angle)}
                totalPlayer={totalPlayer}
                posPlayedCard={posPlayedCard}
				animate={index === playedCard}
				resetState={resetState}
              />
            </>
          );
        })}
      </mesh>
  );
}
