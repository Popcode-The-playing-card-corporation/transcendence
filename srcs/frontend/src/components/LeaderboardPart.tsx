import { generateFakeLeaderboard } from "../utils/generateTestLeaderboard";
import type {  userLB } from "../utils/leaderboardType";

export function LeaderboardPart() {
  const data = generateFakeLeaderboard();
  const leaderboard = data.leaderboard;
  const current = data.current;

  function compare(a: userLB, b: userLB) {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    }
    return 0;
  }

  const sortedLB = leaderboard.sort(compare);

  return (
    <table className="w-full mt-10">
      <thead className="w-full">
        <th className="w-1/3">Rank</th>
        <th className="w-1/3">Username</th>
        <th className="w-1/3">Score</th>
      </thead>
      <tbody className="bg-(--hover-color)">
        <tr className="bg-(--nav-color) h-12 border-b-4 border-(--bg-color)">
          <td className="text-center">{current.rank}</td>
          <td className="text-center">{current.username}</td>
          <td className="text-center">{current.score}</td>
        </tr>
        {sortedLB.map((player) => (
          <tr className="h-10 border-y border-(--bg-color)">
            <td className="text-center">{leaderboard.indexOf(player) + 1}</td>
            <td className="text-center">{player.username}</td>
            <td className="text-center">{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
