import { TextureLoader } from "three";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader } from "@react-three/fiber";
import AdversaryHand from "./AdversaryHand";
import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";

export default function Adversary() {
  const cards = generateFakeAdversary();
  const textureBack = useLoader(TextureLoader, loadTexture("back")!);

  return (
    <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, -2]}>
      {cards.map((cardHand) => {
        return(
          <AdversaryHand cardHand={cardHand} textureBack={textureBack} total={cards.length + 1}/>
        );
      })}
    </mesh>
  );
}