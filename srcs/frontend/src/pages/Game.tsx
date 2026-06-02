import { useState } from "react";
import CreateOrJoin from "../components/Game/createOrJoin/CreateOrJoin";
import WaitingRoom from "../components/Game/waitingRoom/WaitingRoom";

export function Game({ logged_in, logging }: { logged_in: boolean, logging: boolean }) {
  const [isInWaitingRoom, setIsInWaitingRoom] = useState<boolean>(false);
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
        <CreateOrJoin  logged_in={logged_in}/>
      ) : (
        <WaitingRoom logged_in={logged_in} logging={logging}/>
      )}
    </>
  );
}
