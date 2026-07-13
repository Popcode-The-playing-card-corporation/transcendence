import { Canvas, useLoader } from "@react-three/fiber";
import Hand from "./GameVisual/Hand";
import Board from "./GameVisual/Board";
import generateDeck from "../../../utils/createDeck";
import { loadTexture } from "../../../utils/imports/textures";
import { TextureLoader } from "three";

const bgimg = "/assets/bg_game.png"

export default function GameVisual() {
  const deck = generateDeck();
  const loadedTextures: string[] = [];
  const back = useLoader(TextureLoader, loadTexture("back")!);
  deck.forEach((card) => {
    loadedTextures.push(loadTexture(card.value + card.color)!);
  });
  const cardsTex = useLoader(TextureLoader, loadedTextures);
  const boardRadius = 2.3;
  const distanceBoard = boardRadius * 3 / 5;

  return (
    <Canvas className="w-3/4 bg-cover rounded-2xl" linear={true} style={{ backgroundImage: `url(${bgimg})` }}>
      <axesHelper />
      <directionalLight position={[0, 10, 7]} intensity={1.2} color={"#ffe5d5"} />
      <pointLight position={[0, 5, 5]} intensity={10} color={"#ffffff"} />
      <ambientLight />
      <Board front={cardsTex} back={back} boardRadius={boardRadius} distanceBoard={distanceBoard} />
      <Hand cardsTex={cardsTex} back={back} distanceBoard={distanceBoard} />
    </Canvas>
  );
}
