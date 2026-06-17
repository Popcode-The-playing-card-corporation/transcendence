import InfoAndActionPart from "./InfoAndActionPart";
import InviteYourFriends from "./InviteYourFriends";
import ParameterRoom from "./ParameterRoom";
import PlayerList from "./PlayerList";
import { updateParams } from "../../../api/http/game";
import { useNotif } from "../../hooks/useNotif";
import { useGame } from "../context/GameContext";
import { useState, type Dispatch, type SetStateAction } from "react";
import GameMain from "../Game/GameMain";

export default function WaitingRoom({roomCode ,setSimGame}:{roomCode:string, setSimGame: Dispatch<SetStateAction<boolean>>}) {
	
	const notif = useNotif();
	const { state } = useGame();
	const [inGame, setInGame] = useState(false)

	async function updateSettings() {
		const mode = state.settings.mode === 0 ? "private" : state.settings.mode === 2 ? "public" : "friends_only"
		const res = await updateParams(roomCode, {type:mode, max_player: state.settings.maxSize})
		if ("code" in res) {
			notif?.showNotif("Settings Error", res.response, 5000);
		} else {
			notif?.showNotif("Success!", "Game settings succesfully changed!", 5000);
		}
		
	}
	if (inGame) {
		return <GameMain setInGame={setSimGame}/>
	}

    return (
      <div className="mt-17 page-content">  
        <h1>Waiting Room</h1>
		<button className="btn ml-120 mt-10" onClick={() => setInGame(true)}>Simulate launch game</button>
		
        <div className="grid grid-cols-3 gap-6">
          <InfoAndActionPart roomCode={roomCode}/>
          <div className=" space-y-6">
            <PlayerList />
			<InviteYourFriends />
          </div>
          <div className="col-span-2">
            <ParameterRoom roomCode={roomCode} updateSettings={updateSettings}/>
          </div>
        </div>
      </div>
    );
}
