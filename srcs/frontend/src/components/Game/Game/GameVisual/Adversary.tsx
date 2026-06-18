import type { Texture, TextureEventMap } from "three";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import AdversaryHand from "./AdversaryHand";
import  { type boardT, defaultBoard } from "../../../../utils/type/boardType";
import PlayedCard from "./PlayedCard";

type Props = {
  cardHand: adversaryT, 
  playedCard: boardT,
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer: number,
  boardRadius: number
}

export default function Adversary({cardHand, playedCard, back, totalPlayer, boardRadius} : Props) {
  const angleCenter = 360 / totalPlayer * Math.PI / 180;
  const idPlayer = 3;
  if (!playedCard)
    playedCard = defaultBoard;
  const id = (playedCard.playerPos - idPlayer) % totalPlayer;
  const distanceBoard = 1.8;
  const centerHand = Math.cos(angleCenter / 2) * boardRadius;
  const posPlayedCard = centerHand - distanceBoard;

  return (
    <>
      <mesh
        rotation={[0, 0, angleCenter * (cardHand.position + 1)]}
        position={[centerHand* Math.sin(angleCenter * (cardHand.position + 1)), centerHand *  -Math.cos(angleCenter * (cardHand.position + 1)), 0]}
      >
        <PlayedCard
          card={playedCard.card.value + playedCard.card.color}
          id={id}
          posPlayedCard={posPlayedCard}
        />
        <AdversaryHand
          angleCenter={angleCenter}
          cardHand={cardHand}
          back={back}
          totalPlayer={totalPlayer}
          boardRadius={boardRadius}
          posPlayedCard={posPlayedCard}
        />
        <axesHelper />
      </mesh>
      </>
  );
}

  // posPlayedCard.push(Math.sin(angleCenter * id) * distanceBoard);
  // posPlayedCard.push(-Math.cos(angleCenter * id) * distanceBoard);