import { MeshPhongMaterial, TextureLoader } from "three";
import PCard from "./PCard";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader } from "@react-three/fiber";
import generateFakeHandCards from "../../../../utils/test_funcs/generateFakeHandCards";

export default function Hand() {
  const back = useLoader(TextureLoader, loadTexture("back")!);
  const hand = generateFakeHandCards();
  const loadedTextures: string[] = [];
  hand.cards.forEach((card) => {
    loadedTextures.push(loadTexture(card.value + card.color)!);
  });
  const textures = useLoader(TextureLoader, loadedTextures);

  return (
    <mesh>
      {hand.cards.map((card) => {
        const cardIndex = hand.cards.indexOf(card);
        const front = textures.at(cardIndex);
        const materials = [
          new MeshPhongMaterial({ color: 0xffffff }),
          new MeshPhongMaterial({ color: 0xffffff }),
          new MeshPhongMaterial({ color: 0xffffff }),
          new MeshPhongMaterial({ color: 0xffffff }),
          new MeshPhongMaterial({ map: front }),
          new MeshPhongMaterial({ map: back }),
        ]

        return (
          <PCard
            key={card.id}
            position={[cardIndex * 1.1 - 1.5, -2.5 , 2]}
            material={materials}
			userData-cardIndex={cardIndex}
			userData-card={card}
          />
        );
      })}
    </mesh>
  );
}
