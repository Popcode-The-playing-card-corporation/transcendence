import { TextureLoader } from "three";
import PCard from "./PCard";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader, } from "@react-three/fiber";
import generateFakeHandCards from "../../../../utils/test_funcs/generateFakeHandCards";

export default function Hand() {
  const back = useLoader(TextureLoader, loadTexture("back")!);
  const hand = generateFakeHandCards();
  const loadedTextures: string[] = [];
  hand.cards.forEach((card) => {
    loadedTextures.push(loadTexture(card.value + card.color)!);
  });
  const textures = useLoader(TextureLoader, loadedTextures);
  const startPos = ((0.4 * hand.cards.length / 2) - 0.20);

  
  return (
    <mesh>
      {hand.cards.map((card) => {
        const cardIndex = hand.cards.indexOf(card);
        const front = textures.at(cardIndex);

        return (
          <PCard
            key={card.id}
            cardIndex={cardIndex}
            card={card}
            startPos={startPos}
			front={front}
			back={back}
          />
        );
      })}
    </mesh>
  );
}
