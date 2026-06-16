import generateFakeBoard from "../../../../utils/test_funcs/generateFakeBoard";
import Adversary from "./Adversary";
import PlayedCard from "./PlayedCard";
import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
import { useLoader } from "@react-three/fiber";
import { loadTexture } from "../../../../utils/imports/textures";
import { TextureLoader } from "three";

export default function Board() {
  const cards = generateFakeBoard();
  const adversaries = generateFakeAdversary();
  const textureBack = useLoader(TextureLoader, loadTexture("back")!);
  const idPlayer = 3;
  const totalPlayer = adversaries.length + 1;
  const boardRadius = 3;


  return (
    <>
      <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, -2]}>
        <circleGeometry args={[boardRadius, 50]}/>
        <meshStandardMaterial color={"#7d02b4"}/>
        {cards.map((card) => {
          return (
            <>
              {card.position === idPlayer ? "" : (
                <>
                  <PlayedCard card={card.card.value + card.card.color} id={(card.position - idPlayer) % totalPlayer} total={totalPlayer}/>
                </>
              )}
            </>
        );})}
        {adversaries.map((adversary) => {
          return(
            <>
              <Adversary cardHand={adversary} textureBack={textureBack} totalPlayer={totalPlayer} boardRadius={boardRadius}/>
            </>
          );
        })}
      </mesh>
    </>
  );
}
