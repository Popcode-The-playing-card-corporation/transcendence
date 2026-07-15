// import generateFakeBoard from "../../../../utils/test_funcs/generateFakeBoard";
import Adversary from "./Adversary";
// import PlayedCard from "./PlayedCard";
// // import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
// import generateFakeAdversary from "../../../../utils/test_funcs/generateFakeAdversary";
import { Texture, type TextureEventMap } from "three";
import { useGame } from "../../context/GameContext";

type Props = {
	front: Texture<HTMLImageElement, TextureEventMap>[],
	back: Texture<HTMLImageElement, TextureEventMap>,
	boardRadius: number,
	distanceBoard: number
}

export default function Board({front, back, boardRadius, distanceBoard} : Props) {
  
//   const cards = generateFakeBoard();
  const { state } = useGame();
  const cards = state.game.boardData.board;
  const adversaries = state.game.boardData.player_list;
  const idPlayer = Number(state.game.boardData.self_id);
  const totalPlayer = adversaries.length;


  return (
    <>
      <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, 0]}>
        <circleGeometry args={[boardRadius, 50]}/>
        <meshStandardMaterial color={"#7d02b4"}/>

        {adversaries.map((adversary) => {

			const position =  (((adversary.room_id - idPlayer) % totalPlayer) + totalPlayer) % totalPlayer;

			const new_cards = cards.filter((card) => card.room_id === adversary.room_id)[0]
			let card = {color:"", value:"", id:-1};
			if (new_cards) {
				card = new_cards.card;
			}
			
          return(
            <>
              <Adversary
			    key={adversaries.indexOf(adversary)}
                position={position}
                room_id={adversary.room_id}
                isSelf={adversary.room_id == idPlayer}
                boardRadius={boardRadius}
                cardHand={{position:position, nbCards:adversary.hand}}
                playedCard={{playerPos:position, card}}
                front={front}
                back={back}
                totalPlayer={totalPlayer}
				distanceBoard={distanceBoard}
              />
            </>
          );
        })}
      </mesh>
    </>
  );
}
