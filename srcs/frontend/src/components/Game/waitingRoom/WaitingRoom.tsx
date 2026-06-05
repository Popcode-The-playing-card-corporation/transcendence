import { useState } from "react";
import InfoAndActionPart from "./InfoAndActionPart";
import InviteYourFriends from "./InviteYourFriends";
import ParameterRoom from "./ParameterRoom";
import PlayerList from "./PlayerList";
import { updateParams } from "../../../api/http/game";
import { useNotif } from "../../hooks/useNotif";
import type { playerT } from "../../../utils/type/playerType";

type Props = {
	kickPlayer: (playerId: number) => void;
	startGame: () => void;
	listPlayer: playerT[]
	roomCode: string;
}

export default function WaitingRoom({kickPlayer, startGame, roomCode, listPlayer} : Props) {
	
	const private_room = 0; const public_room = 1;
	
	const [mode, setMode] = useState(private_room);
	const [maxSize, setSize] = useState(2);

	const notif = useNotif();

	async function updateSettings() {
		const roomMode = mode === private_room ? "private" : mode === public_room ? "public" : "friends_only";
		const res = await updateParams(roomCode, JSON.stringify({type:roomMode, max_player:maxSize}))
		if ("code" in res) {
			notif?.showNotif("Settings Error", res.response, 5000);
		}
	}

    return (
      <div className="mt-17 page-content">  
        <h1>Waiting Room</h1>
		{//<button className="btn ml-120 mt-10" onClick={() => setInGame(true)}>Simulate launch game</button>
		}
        <div className="grid grid-cols-3 gap-6">
          <InfoAndActionPart roomCode={roomCode} startGame={startGame}/>
          <div className=" space-y-6">
            <PlayerList kickPlayer={kickPlayer} roomCode={roomCode} listPlayer={listPlayer}/>
			<InviteYourFriends roomCode={roomCode}/>
          </div>
          <div className="col-span-2">
            <ParameterRoom roomCode={roomCode} setMode={setMode} setSize={setSize} mode={mode} maxSize={maxSize} updateSettings={updateSettings}/>
          </div>
        </div>
      </div>
    );
}
