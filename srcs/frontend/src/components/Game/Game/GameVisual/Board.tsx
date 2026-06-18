import generateFakeBoard from "../../../../utils/test_funcs/generateFakeBoard";
import Adversary from "./Adversary";
import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
import { Texture, type TextureEventMap } from "three";

export default function Board({back} : {back: Texture<HTMLImageElement, TextureEventMap>}) {
  const cards = generateFakeBoard();
  const adversaries = generateFakeAdversary();
  const totalPlayer = adversaries.length + 1;
  const boardRadius = 3;


  return (
    <>
      <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, -2]}>
        <circleGeometry args={[boardRadius, 50]}/>
        <meshStandardMaterial color={"#7d02b4"}/>
        {/* {cards.map((card) => {
          return (
            <>
              {card.position === idPlayer ? "" : (
                <>
                </>
              )}
            </>
        );})} */}
        {adversaries.map((adversary) => {
          return(
            <>
              <Adversary
                cardHand={adversary}
                playedCard={cards[adversaries.indexOf(adversary)]}
                back={back}
                totalPlayer={totalPlayer}
                boardRadius={boardRadius}
              />
            </>
          );
        })}
      </mesh>
    </>
  );
}
