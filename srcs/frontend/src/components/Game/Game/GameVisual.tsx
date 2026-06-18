import { Canvas, useLoader } from "@react-three/fiber";
import Hand from "./GameVisual/Hand";
import Board from "./GameVisual/Board";
import generateDeck from "../../../utils/createDeck";
import { loadTexture } from "../../../utils/imports/textures";
import { TextureLoader } from "three";
import { OrbitControls } from '@react-three/drei'


export default function GameVisual() {
  const deck = generateDeck();
  const loadedTextures: string[] = [];
  const back = useLoader(TextureLoader, loadTexture("back")!);
  deck.forEach((card) => {
	  // console.log(card.value + card.color);
	  
    loadedTextures.push(loadTexture(card.value + card.color)!);
  });
  const cardsTex = useLoader(TextureLoader, loadedTextures);

  return (
    <Canvas className="bg-(--green-color) w-3/4">
      <ambientLight />
      <Board back={back}/>
      <Hand cardsTex={cardsTex} back={back}/>
      {/* <OrbitControls /> */}
    </Canvas>
  );
}
