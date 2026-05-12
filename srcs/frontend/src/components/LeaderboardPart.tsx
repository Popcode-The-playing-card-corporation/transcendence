import { useEffect, useState } from "react";
import { getLeaderboard, leaderboardArray } from "../api/leaderboard";
// import { generateFakeLeaderboard } from "../utils/generateTestLeaderboard";
import type { leaderboardT, userLB } from "../utils/leaderboardType";
import type { errorT } from "../utils/errorType";

export function LeaderboardPart() {
//   const data = generateFakeLeaderboard();
//   const leaderboard = data.leaderboard;
//   const current = data.current;
  const [leaderboard_gen, setLeaderboard] = useState< leaderboardT | errorT>({code: 0, response:""});
  
  useEffect(() => {
	async function requestLeaderboard() {
		const result = await getLeaderboard();
		if ("code" in result) {
			setLeaderboard(result);
			return ;
		}
		setLeaderboard(leaderboardArray(result));
		return ;
	}

	requestLeaderboard();
  }, [])

  if ('code' in leaderboard_gen) {
	return <p>Error: {String(leaderboard_gen.response)}</p>; // improve message
  }

  const current = leaderboard_gen.current;
  const leaderboard = leaderboard_gen.leaderboard;

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
        {current.username==="" && current.score===0 && current.rank ===0?null : <tr className="bg-(--nav-color) h-12 border-b-4 border-(--bg-color)">
          <td className="text-center">{current.rank}</td>
          <td className="text-center">{current.username}</td>
          <td className="text-center">{current.score}</td>
        </tr>}
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
