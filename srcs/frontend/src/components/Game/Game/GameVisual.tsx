import { Canvas, useLoader } from "@react-three/fiber";
import Hand from "./GameVisual/Hand";
import Board from "./GameVisual/Board";
import generateDeck from "../../../utils/createDeck";
import { loadTexture } from "../../../utils/imports/textures";
import { TextureLoader } from "three";
import bgimg from "../../../assets/bg_game.png"
import type { Dispatch, SetStateAction } from "react";


export default function GameVisual({setIsEnd} : {setIsEnd : Dispatch<SetStateAction<boolean>>}) {
  const deck = generateDeck();
  const loadedTextures: string[] = [];
  const back = useLoader(TextureLoader, loadTexture("back")!);
  deck.forEach((card) => {
	  console.log(card.value + card.color);
	  
    loadedTextures.push(loadTexture(card.value + card.color)!);
  });
  const cardsTex = useLoader(TextureLoader, loadedTextures);

  return (
    <Canvas className="w-3/4 bg-cover rounded-2xl" style={{backgroundImage: `url(${bgimg})`}}>
      <ambientLight />
      <Board back={back}/>
      <Hand cardsTex={cardsTex} back={back} setIsEnd={setIsEnd}/>
    </Canvas>
  );
}
