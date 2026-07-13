import type { statisticsT } from "../../utils/type/statisticsType";

export function StatisticsPart({stats}:{stats:statisticsT}) {

  return (
    <table className="text-left md:w-screen mx-auto">
      <tr>
        <th className="th-stats">Games played: </th>
        <td>{stats.played}</td>
        <th className="th-stats max-md:hidden">Winrate: </th>
        <td className="max-md:hidden">
          {( stats.played > 0 ? (stats.win / stats.played).toPrecision(3): 0)} (W: {stats.win} L:{" "}
          {stats.lose})
        </td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats ">Winrate: </th>
        <td className="">
          {( stats.played > 0 ? (stats.win / stats.played).toPrecision(3): 0)}
        </td>
	  </tr>
      <tr>
        <th className="th-stats max-md:hidden">Points received:</th>
        <th className="th-stats md:hidden">Points received:</th>
        <td>{stats.total_points}</td>
        <th className="th-stats max-md:hidden">Times tricks chosen:</th>
        <td className="max-md:hidden">{stats.nb_trick_choose}</td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats">Times tricks chosen:</th>
        <td>{stats.nb_trick_choose}</td>
	  </tr>
      <tr>
        <th className="th-stats">Preferred tricks:</th>
        <td>{stats.prefered_trick !== "null" ? stats.prefered_trick : "none"}</td>
        <th className="th-stats max-md:hidden">Folds taken:</th>
        <td className="max-md:hidden">{stats.nb_taken}</td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats">Folds taken:</th>
        <td>{stats.nb_taken}</td>
	  </tr>
      <tr>
        <th className="th-stats">Last folds taken:</th>
        <td>{stats.nb_last_take}</td>
        <th className="th-stats max-md:hidden">Total hand meld points: </th>
        <td className="max-md:hidden">{stats.hand_meld_points}</td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats">Total hand meld points: </th>
        <td>{stats.hand_meld_points}</td>
	  </tr>
      <tr>
        <th className="th-stats">Total board meld points: </th>
        <td>{stats.board_meld_points}</td>
        <th className="th-stats max-md:hidden">Highest hand meld:</th>
        <td className="max-md:hidden">{stats.highest_hand_meld}</td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats">Highest hand meld:</th>
        <td>{stats.highest_hand_meld}</td>
	  </tr>
      <tr>
        <th className="th-stats">Highest board meld:</th>
        <td>{stats.highest_board_meld}</td>
        <th className="th-stats max-md:hidden">Game as host:</th>
        <td className="max-md:hidden">{stats.nb_host}</td>
      </tr>
	  <tr className="md:hidden">
        <th className="th-stats">Game as host:</th>
        <td>{stats.nb_host}</td>
	  </tr>
    </table>
  );
}
