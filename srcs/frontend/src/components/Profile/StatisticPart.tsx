import type { statisticsT } from "../../utils/type/statisticsType";

export function StatisticsPart({stats}:{stats:statisticsT}) {

  return (
    <table className="text-left w-screen">
      <tr>
        <th className="th-stats">Games played: </th>
        <td>{stats.played}</td>
        <th className="th-stats">Winrate: </th>
        <td>
          {( stats.played > 0 ? (stats.win / stats.played).toPrecision(3): 0)} (W: {stats.win} L:{" "}
          {stats.lose})
        </td>
      </tr>
      <tr>
        <th className="th-stats">Total points received:</th>
        <td>{stats.total_points}</td>
        <th className="th-stats">Times tricks chosen:</th>
        <td>{stats.nb_trick_choose}</td>
      </tr>
      <tr>
        <th className="th-stats">Prefered tricks</th>
        <td>{stats.prefered_trick !== "null" ? stats.prefered_trick : "none"}</td>
        <th className="th-stats">Times fold taken</th>
        <td>{stats.nb_taken}</td>
      </tr>
      <tr>
        <th className="th-stats">Times last fold taken:</th>
        <td>{stats.nb_last_take}</td>
        <th className="th-stats">Total hand meld points: </th>
        <td>{stats.hand_meld_points}</td>
      </tr>
      <tr>
        <th className="th-stats">Total board meld points: </th>
        <td>{stats.board_meld_points}</td>
        <th className="th-stats">Highest hand meld:</th>
        <td>{stats.highest_hand_meld}</td>
      </tr>
      <tr>
        <th className="th-stats">Highest board meld:</th>
        <td>{stats.highest_board_meld}</td>
        <th className="th-stats">Games as host:</th>
        <td>{stats.nb_host}</td>
      </tr>
    </table>
  );
}
