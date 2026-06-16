import { useState, type SetStateAction } from "react";
import CreateOrJoin from "../components/Game/createOrJoin/CreateOrJoin";
import GameWebSocket from "../components/Game/GameWebSocket";

export function Game({
  setIsGamePage,
}: {
  setIsGamePage: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [isInWaitingRoom, setIsInWaitingRoom] = useState<boolean>(true);

  return (
    <>
      <label className="mt-20 -mb-17 text-center ">
        Switch waitingRoom or choose create/join game
        <input
          type="checkbox"
          defaultChecked
          className="toggle ml-5"
          onChange={() => setIsInWaitingRoom(!isInWaitingRoom)}
        />
      </label>
      {!isInWaitingRoom ? (
        <CreateOrJoin setIsInGame={setIsGamePage}/>
      ) : (
        <GameWebSocket setIsInGame={setIsGamePage}/>
      )}
    </>
  );
}
