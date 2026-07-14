import AdversaryCard from "./AdversaryCard";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import { type Texture, type TextureEventMap } from "three";
import React, { useEffect, useState, type SetStateAction } from "react";
import { useGame } from "../../context/GameContext";
import { Text, Image } from "@react-three/drei";

type Props = {
  room_id:number,
  setShow: React.Dispatch<SetStateAction<boolean>>,
  angleCenter:number,
  cardHand: adversaryT, 
  fronts: Texture<HTMLImageElement, TextureEventMap>[],
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer:number,
  boardRadius: number,
  posPlayedCard: number
}

export default function AdversaryHand({room_id, setShow, angleCenter, cardHand, fronts, back, totalPlayer, boardRadius, posPlayedCard} : Props) {
  
  const [simCards, setCards] = useState(cardHand.nbCards);
  const [playedCard, setPlayed] = useState<number | null>(null);
  const { state } = useGame();
  const angleBetween = Math.PI / 30;
  const littleRadius = Math.sin(angleCenter / 2) * boardRadius;
  const angleStart = - (cardHand.nbCards - 1) * angleBetween / 2;
  const allAngle : number[] = [];

  useEffect(() => {
	async function handle_continue() {
		if (state.event === "game_continued") {
			setCards(cardHand.nbCards);
		}
	}
	handle_continue();
  }, [state.event, cardHand.nbCards])


	useEffect(() => {
		function handle_less() {
			if (cardHand.nbCards < simCards && playedCard === null) {
				setPlayed(simCards - 1);
			}
		}
		handle_less();
	}, [cardHand.nbCards, simCards, playedCard]);

	useEffect(() => {
	setShow(playedCard === null);
	}, [playedCard, setShow]);

  for (let i = 0; i < simCards; i++)
    allAngle.push(angleStart + i * angleBetween);

  function resetState() {
	setCards(cardHand.nbCards);
	setPlayed(null);
  }
  let factor;

  if (totalPlayer === 2)
    factor = -littleRadius / 4;
  else
    factor = littleRadius / 6;

  return (
      <>
      <mesh position={[0, (-littleRadius) + factor, 0]} rotation={[0, 0, Math.PI]}>
        <Image scale={0.4} url={state.game.boardData.player_list[room_id].user.avatar} position={[-1, 0, 0]}/>
        <Text fontSize={0.2}>
          {state.game.boardData.player_list[room_id].user.username}
          <meshStandardMaterial />
        </Text>
      </mesh>
      <mesh
      >
        {allAngle.map((angle, index) => {
          
          const board = state.game.boardData.board.at(-1)
          let cardID = 0;
          if (board) {
            cardID = board.card.id;
          }
          
          return (
            <>
            <AdversaryCard
			  key={index}
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
    </>
  );
}
