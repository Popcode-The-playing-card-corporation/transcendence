import LittleLeaderboard from "./LittleLeaderboard";
import DetailledLeaderboard from "./DetailledLeaderboard";

export default function LeaderboardInGame() {
  return (
    <div className="p-2 overflow-scroll">
      <LittleLeaderboard />
      <DetailledLeaderboard />
    </div>
  );
}
