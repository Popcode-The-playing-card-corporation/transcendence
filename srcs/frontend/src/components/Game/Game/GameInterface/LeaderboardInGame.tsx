import Time from "./Time";
import LittleLeaderboard from "./LittleLeaderboard";
import DetailledLeaderboard from "./DetailledLeaderboard";
import CurrentInfo from "./CurrentInfo";

export default function LeaderboardInGame() {
  return (
    <div className="h-1/2 p-2 flex flex-col items-center">
      <Time />
	  <CurrentInfo />
      <LittleLeaderboard />
      <DetailledLeaderboard />
    </div>
  );
}
