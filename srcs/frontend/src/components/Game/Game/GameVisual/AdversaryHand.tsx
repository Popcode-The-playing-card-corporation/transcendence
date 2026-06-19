import AdversaryCard from "./AdversaryCard";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import type { Texture, TextureEventMap } from "three";

type Props = {
  angleCenter:number,
  cardHand: adversaryT, 
  back: Texture<HTMLImageElement, TextureEventMap>
  totalPlayer:number,
  boardRadius: number,
  posPlayedCard: number
}

export default function AdversaryHand({angleCenter, cardHand, back, totalPlayer, boardRadius, posPlayedCard} : Props) {
  const angleBetween = Math.PI / 30;
  const littleRadius = Math.sin(angleCenter / 2) * boardRadius;
  const angleStart = - (cardHand.nbCards - 1) * angleBetween / 2;
  const allAngle : number[] = [];
  for (let i = 0; i < cardHand.nbCards; i++)
    allAngle.push(angleStart + i * angleBetween);

  return (
      <mesh
      >
        {allAngle.map((angle) => {
          return (
            <>
              <AdversaryCard
                angle={angle}
                littleRadius={littleRadius}
                back={back}
                positionCard={allAngle.indexOf(angle)}
                totalPlayer={totalPlayer}
                posPlayedCard={posPlayedCard}
              />
            </>
          );
        })}
      </mesh>
  );
}
