import { generateFakeStats } from "../utils/generateTestStats";

export function StatisticsPart() {
  const stats = generateFakeStats();

  return (
    <table className="text-left ">
      <tr>
        <th className="th-stats">Game played: </th>
        <td>{stats.played}</td>
      </tr>
      <tr>
        <th className="th-stats">Winrate: </th>
        <td>
          {(stats.winned / stats.played).toPrecision(3)} (W: {stats.winned} L:{" "}
          {stats.loosed})
        </td>
      </tr>
      <tr>
        <th className="th-stats">Total points recieve:</th>
        <td>{stats.totalPoints}</td>
      </tr>
      <tr>
        <th className="th-stats">Times tricks choosen</th>
        <td>{stats.nbTricksChoose}</td>
      </tr>
      <tr>
        <th className="th-stats">Prefered tricks</th>
        <td>{stats.PreferedTrick}</td>
      </tr>
      <tr>
        <th className="th-stats">Times fold taken</th>
        <td>{stats.nbTaken}</td>
      </tr>
      <tr>
        <th className="th-stats">Times last fold taken</th>
        <td>{stats.nbLastTake}</td>
      </tr>
      <tr>
        <th className="th-stats">Total hand meld points: </th>
        <td>{stats.handMeldPoints}</td>
      </tr>
      <tr>
        <th className="th-stats">Total board meld points: </th>
        <td>{stats.boardMeldPoints}</td>
      </tr>
      <tr>
        <th className="th-stats">Highest hand meld</th>
        <td>{stats.handMeldPoints}</td>
      </tr>
      <tr>
        <th className="th-stats">Highest board meld</th>
        <td>{stats.boardMeldPoints}</td>
      </tr>
      <tr>
        <th className="th-stats">Total hosting game</th>
        <td>{stats.nbHost}</td>
      </tr>
    </table>
  );
}
