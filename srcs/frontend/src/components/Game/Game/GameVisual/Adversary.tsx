import type { Texture, TextureEventMap } from "three";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import AdversaryHand from "./AdversaryHand";

type Props = {
  cardHand: adversaryT, 
  textureBack: Texture<HTMLImageElement, TextureEventMap>,
  total: number
}


export default function Adversary({cardHand, textureBack, total} : Props) {
  const angleCenter = 360 / total * Math.PI / 180;
  const distance = Math.cos(angleCenter / 2) * 3;

  return (
      <mesh
        position={[distance * Math.sin(angleCenter * (cardHand.position + 1)) * 3, distance *  -Math.cos(angleCenter * (cardHand.position + 1)) * 3, 0]}
      >
          <AdversaryHand
            angleCenter={angleCenter}
            cardHand={cardHand}
            textureBack={textureBack}
            total={total}
          />
      </mesh>
  );
}
//  * 
//  * 