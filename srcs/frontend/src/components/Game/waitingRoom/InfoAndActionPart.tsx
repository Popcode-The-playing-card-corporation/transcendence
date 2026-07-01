import { IoMdExit } from "react-icons/io";
import { useGame } from "../context/GameContext";
import Chrono from "./Chrono";
import CopyBtn from "./CopyBtn";
import StartGameBtn from "./StartGameBtn";

export default function InfoAndActionPart({ roomCode }: { roomCode: string }) {
  const { leaveRoom, state } = useGame();
  let is_host = false;
  if (state.settings.listPlayer.filter((user) => user.is_host)[0]) {
    is_host =
      state.user ===
      state.settings.listPlayer.filter((user) => user.is_host)[0].username;
  }

  return (
    <div className=" mt-10 -mb-10 col-span-3 flex justify-between items-end">
      <div className="flex items-end gap-2">
        <button className="btn mr-5 del z-1" onClick={leaveRoom}>
          <IoMdExit />{" "}
        </button>
        <div className="flex gap-3 flex-col justify-center items-center text-center w-fit">
          <p className="flex text-center">Room Code</p>
          <p className="w-full flex rounded-md bg-secondary text-lg p-2">
            {roomCode} <CopyBtn code={roomCode} />{" "}
          </p>
        </div>
      </div>
      <Chrono />
      { is_host ?  <StartGameBtn /> : <div className="w-26"></div>}
    </div>
  );
}
