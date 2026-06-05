import LeaderboardInGame from "./LeaderboardInGame";
import GameButtons from "./GameInterface/GameButtons";

export default function Interface() {
	return (
		<div className="w-1/4 h-full ">
      <LeaderboardInGame />
      <GameButtons />
		</div>
	)
}
