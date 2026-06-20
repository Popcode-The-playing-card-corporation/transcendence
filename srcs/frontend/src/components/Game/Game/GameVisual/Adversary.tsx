import type { Texture, TextureEventMap } from "three";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import AdversaryHand from "./AdversaryHand";
import  { type boardT, defaultBoard } from "../../../../utils/type/boardType";
import PlayedCard from "./PlayedCard";
import { useState } from "react";

type Props = {
  isSelf: boolean,
  cardHand: adversaryT, 
  playedCard: boardT,
  front: Texture<HTMLImageElement, TextureEventMap>[],
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer: number,
  boardRadius: number
}

export default function Adversary({isSelf, cardHand, playedCard, front, back, totalPlayer, boardRadius} : Props) {
  const angleCenter = 360 / totalPlayer * Math.PI / 180;
  const [show, setShow] = useState(true)
  if (!playedCard)
    playedCard = defaultBoard;
  const distanceBoard = 1.8;
  const centerHand = Math.cos(angleCenter / 2) * boardRadius;
  const posPlayedCard = centerHand - distanceBoard;

  return (
    <>
      <mesh
        rotation={[0, 0, angleCenter * (cardHand.position)]}
        position={[centerHand* Math.sin(angleCenter * (cardHand.position)), centerHand *  -Math.cos(angleCenter * (cardHand.position)), 0]}
      >
        {playedCard.card.id !== -1 ? <PlayedCard
		  show={show}
          front={front[playedCard.card.id]}
		  back={back}
          posPlayedCard={posPlayedCard}
        /> : null}
        { isSelf ? null :<AdversaryHand
		  setShow={setShow}
          angleCenter={angleCenter}
          cardHand={cardHand}
		  fronts={front}
          back={back}
          totalPlayer={totalPlayer}
          boardRadius={boardRadius}
          posPlayedCard={posPlayedCard}
        />}
      </mesh>
      </>
  );
}

  // posPlayedCard.push(Math.sin(angleCenter * id) * distanceBoard);
  // posPlayedCard.push(-Math.cos(angleCenter * id) * distanceBoard);