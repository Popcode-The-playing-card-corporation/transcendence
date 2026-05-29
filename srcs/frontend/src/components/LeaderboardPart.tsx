import type { leaderboardT } from "../utils/leaderboardType";
import UsernameMiniProfileBtn from "./MiniProfile/UsernameMiniProfileBtn";

export function LeaderboardPart({tmp_leaderboard, logged_in}:{tmp_leaderboard:leaderboardT, logged_in:boolean}) {

  const current = tmp_leaderboard.current;
  const leaderboard = tmp_leaderboard.leaderboard;

  return (
    <table className="w-full mt-10">
      <thead className="w-full">
        <th className="w-1/3">Rank</th>
        <th className="w-1/3">Username</th>
        <th className="w-1/3">Score</th>
      </thead>
      <tbody className="bg-(--hover-color)">
        {current.username==="" && current.score===0 && current.rank ===0?null : <tr className="bg-(--nav-color) h-12 border-b-4 border-(--bg-color)">
          <td className="text-center">{current.rank}</td>
          <td className="text-center">{current.username}</td>
          <td className="text-center">{current.score}</td>
        </tr>}
        {leaderboard.map((player) => (
          <tr className="h-10 border-y border-(--bg-color)">
            <td className="text-center">{leaderboard.indexOf(player) + 1}</td>
            <td className="text-center"><UsernameMiniProfileBtn id={player.id} name={player.username} logged_in={logged_in} /></td>
            <td className="text-center">{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
