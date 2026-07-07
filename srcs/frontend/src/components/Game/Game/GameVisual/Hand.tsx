import { Texture, type TextureEventMap } from "three";
import PCard from "./PCard";
import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";

export default function Hand({
  cardsTex,
  back,
  distanceBoard
}: {
  cardsTex: Texture<HTMLImageElement, TextureEventMap>[];
  back: Texture<HTMLImageElement, TextureEventMap>;
  distanceBoard: number;
}) {
  const { state } = useGame();
  const hand = state.game.self_cards.hand
  const [simHand, setHand] = useState(hand);
  const startPos = (0.4 * hand.length) / 2 - 0.2;
  const oldStartPos = (0.4 * (hand.length + 1)) / 2 - 0.2;
  const [lastCardPlayed, setLastCardPlayed] = useState<number>(19);
  

  useEffect(() => {
	async function handle_continue() {
		if (state.event === "game_continued") {
			setHand(state.game.self_cards.hand);
		}
	}
	handle_continue();
  }, [state.event, state.game.self_cards.hand])

  return (
      <mesh>
        {simHand.map((card) => {
          const cardIndex = simHand.indexOf(card);

          return (
            <PCard
              key={card.id}
              cardIndex={cardIndex}
              card={card}
              startPos={startPos}
			  oldStartPos={oldStartPos}
              front={cardsTex[card.id]}
              back={back}
			  lastCardPlayed={lastCardPlayed}
			  setHand={setHand}
			  setLastCardPlayed={setLastCardPlayed}
			  distanceBoard={distanceBoard}
            />
          );
        })}
      </mesh>
  );
}
