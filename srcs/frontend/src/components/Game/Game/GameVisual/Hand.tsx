import { Texture, type TextureEventMap } from "three";
import PCard from "./PCard";
import generateFakeHandCards from "../../../../utils/test_funcs/generateFakeHandCards";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { cardType } from "../../../../utils/type/handCardsType";
// import { useGame } from "../../context/GameContext";

export default function Hand({
  cardsTex,
  back,
  setIsEnd,
}: {
  cardsTex: Texture<HTMLImageElement, TextureEventMap>[];
  back: Texture<HTMLImageElement, TextureEventMap>;
  setIsEnd: Dispatch<SetStateAction<boolean>>;
}) {
  // const game = useGame();
  const [hand, setHand] = useState<cardType[]>(generateFakeHandCards().cards);
  const startPos = (0.4 * hand.length) / 2 - 0.2;
  const oldStartPos = (0.4 * (hand.length + 1)) / 2 - 0.2;
  const [lastCardPlayed, setLastCardPlayed] = useState<number>(19);

  useEffect(() => {
    if (hand.length === 0) setIsEnd(true);
  }, [hand.length, setIsEnd]);

  return (
    <mesh>
      {hand.map((card) => {
        const cardIndex = hand.indexOf(card);

        return (
          <PCard
            key={card.id}
            cardIndex={cardIndex}
            card={card}
            startPos={startPos}
            setHand={setHand}
            hand={hand}
            oldStartPos={oldStartPos}
            front={cardsTex[card.id]}
            back={back}
            lastCardPlayed={lastCardPlayed}
            setLastCardPlayed={setLastCardPlayed}
          />
        );
      })}
    </mesh>
  );
}
