import type { achievementT } from "../../utils/type/achievementType";

export function achievementPart({tmp_achievement}:{tmp_achievement:achievementT}) {

  const achievement = tmp_achievement.achievement;
  console.log("test"+ achievement)
  return (
	<table className="w-full mt-10">
	  <thead className="w-full">
		<th className="w-1/3">Rank</th>
		<th className="w-1/3">Username</th>
		<th className="w-1/3">Score</th>
	  </thead>
	  <tbody className="bg-base-100">
		{achievement.map((player) => (
		  <tr className="h-10 border-y border-base-200">
			<td className="text-center">{achievement.indexOf(player) + 1}</td>
			<td className="text-center">{player.title}</td>
			<td className="text-center">{player.rate}</td>
		  </tr>
		))}
	  </tbody>
	</table>
  );
}
