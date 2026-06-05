import type { SetStateAction } from "react";
import InfoAndActionPart from "./InfoAndActionPart";
import InviteYourFriends from "./InviteYourFriends";
import ParameterRoom from "./ParameterRoom";
import PlayerList from "./PlayerList";
import type React from "react";

type Props = {
	kickPlayer: (playerId: number) => void;
	startGame: () => void;
}

export default function WaitingRoom({kickPlayer, startGame} : Props) {

	setIsInGame(false)
    return (
      <div className="mt-17 page-content">  
        <h1>Waiting Room</h1>
		<button className="btn ml-120 mt-10" onClick={() => setInGame(true)}>Simulate launch game</button>
        <div className="grid grid-cols-3 gap-6">
          <InfoAndActionPart />
          <div className=" space-y-6">
            <PlayerList/>
			<InviteYourFriends/>
          </div>
          <div className="col-span-2">
            <ParameterRoom />
          </div>
        </div>
      </div>
    );
}
