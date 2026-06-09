import { MeshPhongMaterial, TextureLoader } from "three";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader, useThree } from "@react-three/fiber";
import generateFakeBoard from "../../../../utils/test_funcs/generateFakeBoard";
import AdversaryHand from "./AdversaryHand";

export default function Adversary() {
  const cards = generateFakeBoard();
  const distance = viewport.height / 2 + 0.3;
  const angle = (360* id /total) * (Math.PI / 180);

  return (
    <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, -2]}>
      {cards.map((card) => {
        return(
          <AdversaryHand card={card.value + card.color} id={id} total={total} />
        );
      })}
    </mesh>
  );
}