import type { leaderboardT } from "../../utils/type/leaderboardType";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";

export function LeaderboardPart({
  tmp_leaderboard,
}: {
  tmp_leaderboard: leaderboardT;
}) {
  const current = tmp_leaderboard.current;
  const leaderboard = tmp_leaderboard.leaderboard;

  return (
    <table className="w-full mt-10">
      <thead className="w-full">
        <th className="w-1/3">Rank</th>
        <th className="w-1/3">Username</th>
        <th className="w-1/3">Score</th>
      </thead>
      <tbody className="bg-base-100">
        {current.username === "" &&
        current.score === 0 &&
        current.rank === 0 ? null : (
          <tr className="bg-primary h-12 border-b-4 border-base-200">
            <td className="text-center">{current.rank}</td>
            <td className="text-center">

                <span className="md:hidden">
                  {current.username.length > 10
                    ? current.username.substring(0, 10) + "..."
                    : current.username}
                </span>
                <span className="max-md:hidden">{current.username}</span>
				</td>
            <td className="text-center">{current.score}</td>
          </tr>
        )}
        {leaderboard.map((player) => (
          <tr className="h-10 border-y border-base-200" key={player.id}>
            <td className="text-center">{player.rank}</td>
            {current.username === player.username ? (
              <td className="text-center">

                <span className="md:hidden">
                  {player.username.length > 10
                    ? player.username.substring(0, 10) + "..."
                    : player.username}
                </span>
                <span className="max-md:hidden">{player.username}</span>
              </td>
            ) : (
              <td className="text-center">
                <UsernameMiniProfileBtn id={player.id} name={player.username} />
              </td>
            )}
            <td className="text-center">{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
