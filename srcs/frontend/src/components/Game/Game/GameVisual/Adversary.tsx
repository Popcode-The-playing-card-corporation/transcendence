import type { Texture, TextureEventMap } from "three";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import AdversaryHand from "./AdversaryHand";
import { type boardT, defaultBoard } from "../../../../utils/type/boardType";
import PlayedCard from "./PlayedCard";
import { useState } from "react";

type Props = {
  position: number,
  room_id: number,
  isSelf: boolean,
  cardHand: adversaryT,
  playedCard: boardT,
  front: Texture<HTMLImageElement, TextureEventMap>[],
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer: number,
  boardRadius: number,
  distanceBoard: number
}

export default function Adversary({ position, room_id, isSelf, cardHand, playedCard, front, back, totalPlayer, boardRadius, distanceBoard }: Props) {
  const angleCenter = 360 / totalPlayer * Math.PI / 180;
  if (!playedCard)
    playedCard = defaultBoard;
  const centerHand = Math.cos(angleCenter / 2) * boardRadius;
  const posPlayedCard = centerHand - distanceBoard;
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <mesh
        rotation={[0, 0, angleCenter * (cardHand.position)]}
        position={[centerHand * Math.sin(angleCenter * (cardHand.position)), centerHand * -Math.cos(angleCenter * (cardHand.position)), 0]}
      >
        {playedCard.card.id !== -1 ?
          <PlayedCard
            show={show}
            front={front[playedCard.card.id]}
            back={back}
            posPlayedCard={posPlayedCard}
            position={position}
          /> : null}
        {isSelf ? null :
          <AdversaryHand
            setShow={setShow}
            room_id={room_id}
            angleCenter={angleCenter}
            cardHand={cardHand}
            fronts={front}
            back={back}
            totalPlayer={totalPlayer}
            boardRadius={boardRadius}
            posPlayedCard={posPlayedCard}
          />
        }
      </mesh>
    </>
  );
}
