import LeaderboardInGame from "./GameInterface/LeaderboardInGame";
import GameButtons from "./GameInterface/GameButtons";
import EndingModal from "./GameInterface/EndingModal";

export default function Interface() {

  return (
    <div className="w-1/4 h-full ">
      <LeaderboardInGame />
      <GameButtons />
      <EndingModal />
    </div>
  );
}
