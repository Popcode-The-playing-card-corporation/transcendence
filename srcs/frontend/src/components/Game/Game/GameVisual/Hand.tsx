import { Texture, type TextureEventMap } from "three";
import PCard from "./PCard";
import generateFakeHandCards from "../../../../utils/test_funcs/generateFakeHandCards";

export default function Hand({
  cardsTex,
  back,
}: {
  cardsTex: Texture<HTMLImageElement, TextureEventMap>[];
  back: Texture<HTMLImageElement, TextureEventMap>;
}) {
  const hand = generateFakeHandCards();
  const startPos = (0.4 * hand.cards.length) / 2 - 0.2;


  return (
      <mesh>
        {hand.cards.map((card) => {
          const cardIndex = hand.cards.indexOf(card);

          return (
            <PCard
              key={card.id}
              cardIndex={cardIndex}
              card={card}
              startPos={startPos}
              front={cardsTex[card.id]}
              back={back}
            />
          );
        })}
      </mesh>
  );
}
