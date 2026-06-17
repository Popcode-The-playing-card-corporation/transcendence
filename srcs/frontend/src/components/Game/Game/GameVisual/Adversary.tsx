import type { Texture, TextureEventMap } from "three";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import AdversaryHand from "./AdversaryHand";

type Props = {
  cardHand: adversaryT, 
  back: Texture<HTMLImageElement, TextureEventMap>,
  totalPlayer: number,
  boardRadius: number
}

export default function Adversary({cardHand, back, totalPlayer, boardRadius} : Props) {
  const angleCenter = 360 / totalPlayer * Math.PI / 180;
  const distance = Math.cos(angleCenter / 2) * boardRadius;

  return (
      <mesh
        rotation={[0, 0, angleCenter * (cardHand.position + 1)]}
        position={[distance * Math.sin(angleCenter * (cardHand.position + 1)), distance *  -Math.cos(angleCenter * (cardHand.position + 1)), 0]}
      >
          <AdversaryHand
            angleCenter={angleCenter}
            cardHand={cardHand}
            back={back}
            totalPlayer={totalPlayer}
            boardRadius={boardRadius}
          />
      </mesh>
  );
}
//  * 
//  * 