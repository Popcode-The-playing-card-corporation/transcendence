import { useGame } from "../context/GameContext";
import Chrono from "./Chrono";
import CopyBtn from "./CopyBtn";
import StartGameBtn from "./StartGameBtn";

export default function InfoAndActionPart({roomCode}:{roomCode:string}) {
	const { leaveRoom, state } = useGame();
	let is_host = false;
	if (state.settings.listPlayer.filter(user => user.is_host)[0]) {
		is_host = state.user === state.settings.listPlayer.filter(user => user.is_host)[0].username;
	}
	
  return (
    <div className=" mt-10 -mb-10 col-span-3 flex justify-between items-end">
      <div className="flex gap-3 flex-col justify-center items-center text-center w-fit">
        <p className="flex text-center">Room Code</p>
        <p className="w-full flex rounded-md bg-(--hover-color) text-lg p-2">
          {roomCode} <CopyBtn code={roomCode} />{" "}
        </p>
      </div>
      <Chrono />
	  <div className="flex justify-center">
        <button className="btn mr-5" onClick={leaveRoom}>Leave Game</button>
      </div>
      { is_host ? <div className="flex justify-center">
        <StartGameBtn />
      </div> : null}
    </div>
  );
}
