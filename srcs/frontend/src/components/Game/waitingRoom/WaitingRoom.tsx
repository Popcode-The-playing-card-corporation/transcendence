import React, { type SetStateAction } from "react";
import InfoAndActionPart from "./InfoAndActionPart";
import InviteYourFriends from "./InviteYourFriends";
import ParameterRoom from "./ParameterRoom";
import PlayerList from "./PlayerList";
import { updateParams } from "../../../api/http/game";
import { useNotif } from "../../hooks/useNotif";
import type { playerT } from "../../../utils/type/playerType";

type Props = {
	leaveRoom: () => void;
	kickPlayer: (playerId: number) => void;
	startGame: () => void;
	listPlayer: playerT[]
	roomCode: string;
	mode: number;
	maxSize: number;
	setMode: React.Dispatch<SetStateAction<number>>;
	setSize: React.Dispatch<SetStateAction<number>>;
}

export default function WaitingRoom({kickPlayer, startGame, roomCode, listPlayer, mode, maxSize, setMode, setSize} : Props) {
	
	const private_room = 0; const friend_room = 1;
	const notif = useNotif();

	async function updateSettings() {
		const roomMode = mode === private_room ? "private" : mode === friend_room ? "friends_only" : "public";
		console.debug(roomCode, "params: ", JSON.stringify({type:roomMode, max_player:maxSize}))
		const res = await updateParams(roomCode, {type:roomMode, max_player:maxSize})
		if ("code" in res) {
			notif?.showNotif("Settings Error", res.response, 5000);
		} else {
			notif?.showNotif("Success!", "Game settings succesfully changed!", 5000);
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
