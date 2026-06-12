import AdversaryCard from "./AdversaryCard";
import type { adversaryT } from "../../../../utils/type/adversaryType";
import type { Texture, TextureEventMap } from "three";

type Props = {
  angleCenter:number,
  cardHand: adversaryT, 
  textureBack: Texture<HTMLImageElement, TextureEventMap>
}

export default function AdversaryHand({angleCenter, cardHand, textureBack} : Props) {
  const angleBetween = Math.PI / 15;
  const littleRadius = Math.sin(angleCenter / 2) * 3;
  const angleStart = angleCenter * (cardHand.position + 1) - (cardHand.nbCards - 1) * angleBetween / 2;
  const allAngle : number[] = [];
  for (let i = 0; i < cardHand.nbCards; i++)
    allAngle.push(angleStart + i * angleBetween);

  return (
    <mesh
    >
      {allAngle.map((angle) => {
        return (
          <AdversaryCard littleRadius={littleRadius + (allAngle.indexOf(angle) % (cardHand.nbCards / 2) * 0.05)} second={0} textureBack={textureBack} angle={angle}/>
        );
      })}
    </mesh>
  );
}
// Math.asin(0.4 / 3)
// Math.sin()
// -Math.cos(angleCenter * (cardHand.position + 1))