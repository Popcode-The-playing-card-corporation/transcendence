import { generateFakeLeaderboard } from "../utils/generateTestLeaderboard";

export function LeaderboardPart() {
  const data = generateFakeLeaderboard();
  const leaderboard = data.leaderboard;
  const current = data.current;

  // const isFind = leaderboard.find((player) => player === current);
  return (
    <table className="w-full">
      <thead className="w-full">
        <th className="w-1/3">rank</th>
        <th className="w-1/3">Usernameborder radius o tbody</th>
        <th className="w-1/3">Score</th>
      </thead>
      <tbody className="bg-(--hover-color) rounded-2xl overflow-hidden">
        {leaderboard.map((player) => (
          <tr className="h-8 border-b">
            <td className="text-center">{leaderboard.indexOf(player) + 1}</td>
            <td className="text-center">{player.username}</td>
            <td className="text-center">{player.score}</td>
          </tr>
        ))}
        <tr className="bg-(--nav-color) h-10">
          <td className="text-center">{current.rank}</td>
          <td className="text-center">{current.username}</td>
          <td className="text-center">{current.score}</td>
        </tr>
      </tbody>
    </table>
  );
}
