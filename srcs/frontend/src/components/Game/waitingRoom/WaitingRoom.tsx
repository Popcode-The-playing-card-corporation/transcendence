import InfoAndActionPart from "./InfoAndActionPart";
import InviteYourFriends from "./InviteYourFriends";
import ParameterRoom from "./ParameterRoom";
import PlayerList from "./PlayerList";
import { useGame } from "../context/GameContext";
import type { SettingsT } from "../../../utils/type/boardDataType";

export default function WaitingRoom({ roomCode }: { roomCode: string }) {

  const { sendParams } = useGame();

  function handleChange(changes: Partial<SettingsT>) {
    let mode = "";
    if ("mode" in changes) {
      mode = changes.mode === 0 ? "private" : changes.mode === 2 ? "public" : "friends_only"
      sendParams({ type: mode });
    } else if ("maxSize" in changes) {
      sendParams({ max_player: changes.maxSize });
    } else {
      sendParams(changes);
    }
  }

  return (
    <div className="mt-17 page-content">
      <h1>Waiting Room</h1>
      <div className="grid grid-cols-3 gap-6">
        <InfoAndActionPart roomCode={roomCode} />
        <div className=" space-y-6">
          <PlayerList />
          <InviteYourFriends />
        </div>
        <div className="col-span-2">
          <ParameterRoom roomCode={roomCode} updateSettings={handleChange} />
        </div>
      </div>
    </div>
  );
}
