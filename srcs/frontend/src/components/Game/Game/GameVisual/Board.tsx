// import generateFakeBoard from "../../../../utils/test_funcs/generateFakeBoard";
import Adversary from "./Adversary";
// import PlayedCard from "./PlayedCard";
// // import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
// import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
import { Texture, type TextureEventMap } from "three";
import { useGame } from "../../context/GameContext";

export default function Board({front, back} : {front: Texture<HTMLImageElement, TextureEventMap>[], back: Texture<HTMLImageElement, TextureEventMap>}) {
  
//   const cards = generateFakeBoard();
  const { state } = useGame();
  const cards = state.game.boardData.board;
  const adversaries = state.game.boardData.player_list;
  const idPlayer = Number(state.game.boardData.self_id);
  const obj = adversaries as Record<string, unknown>;
  const totalPlayer = Object.keys(obj).length;

  const boardRadius = 2.3;


  return (
    <>
      <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, 0]}>
        <circleGeometry args={[boardRadius, 50]}/>
        <meshStandardMaterial color={"#7d02b4"}/>

        {Object.entries(adversaries).map((adversary) => {

			const position =  (((Number(adversary[0]) - idPlayer) % totalPlayer) + totalPlayer) % totalPlayer;

			const new_cards = cards.filter((card) => card.room_id == Number(adversary[0]))[0]
			let card = {color:"", value:"", id:-1};
			if (new_cards) {
				card = new_cards.card;
			}
			
          return(
            <>
              <Adversary
                isSelf={Number(adversary[0]) === idPlayer}
                boardRadius={boardRadius}
                cardHand={{position:position, nbCards:adversary[1].hand}}
                playedCard={{playerPos:position, card}}
                front={front}
                back={back}
                totalPlayer={totalPlayer}
              />
            </>
          );
        })}
      </mesh>
    </>
  );
}
