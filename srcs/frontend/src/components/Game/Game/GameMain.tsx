import { useState, type Dispatch, type SetStateAction } from "react";
import GameVisual from "./GameVisual";
import Interface from "./Interface";

export default function GameMain({
  setInGame,
}: {
  setInGame: Dispatch<SetStateAction<boolean>>;
}) {
  const [isEnd, setIsEnd] = useState(false); // to simulate end game
  setInGame(true);

  return (
    <div className="w-sceen h-screen flex">
      <GameVisual setIsEnd={setIsEnd} />
      <Interface isEnd={isEnd} setIsEnd={setIsEnd}/>
    </div>
  );
}
