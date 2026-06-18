import Time from "./Time";
import LittleLeaderboard from "./LittleLeaderboard";
import DetailledLeaderboard from "./DetailledLeaderboard";

export default function LeaderboardInGame() {
  return (
    <div className="h-1/2 p-2 flex flex-col items-center">
      <Time />
      <LittleLeaderboard />
      <DetailledLeaderboard />
    </div>
  );
}
