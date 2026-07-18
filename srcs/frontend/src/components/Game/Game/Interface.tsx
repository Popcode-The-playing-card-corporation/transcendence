import LeaderboardInGame from "./GameInterface/LeaderboardInGame";
import GameButtons from "./GameInterface/GameButtons";
import EndingModal from "./GameInterface/EndingModal";
import Time from "./GameInterface/Time";
import CurrentInfo from "./GameInterface/CurrentInfo";

export default function Interface() {

  return (
    <div className="flex flex-col w-1/4 h-screen">
      <Time />
      <CurrentInfo />
      <LeaderboardInGame />
      <GameButtons />
      <EndingModal />
    </div>
  );
}
