import LeaderboardInGame from "./GameInterface/LeaderboardInGame";
import GameButtons from "./GameInterface/GameButtons";
import EndingModal from "./GameInterface/EndingModal";
import BeginModal from "./GameInterface/BeginModal";
// import { type Dispatch, type SetStateAction } from "react";

export default function Interface() {

  return (
    <div className="w-1/4 h-full ">
      <LeaderboardInGame />
      <GameButtons />
      <EndingModal />
	  <BeginModal />
    </div>
  );
}
