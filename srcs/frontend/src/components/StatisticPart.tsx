import { useState, useEffect } from "react";
import type { statisticsT } from "../utils/statisticsType";
import type { errorT } from "../utils/errorType";
import { getStats } from "../api/stats";
import { useNavigate } from "react-router-dom";
import { refreshAuth } from "../api/checkAuth";
import { profileRequest } from "../api/profile";


export function StatisticsPart() {
    const [stats, setStats] = useState< statisticsT | errorT>({code: 0, response: ''});
	const navigate = useNavigate();

	useEffect(() => {
		async function getID() {
			let user = await profileRequest();
			if ('code' in user) {
				if (user.code === 401) {
					if (!(await refreshAuth())) {
						navigate('/login');
					}
					user = await profileRequest();
				}
			}
			if ('code' in user) {
				return -1;
			}
			return user.id;
		}

		async function retrieveStats() {
			const id = await getID();
			if (id === -1) {
				return ;
			}
			let res = await getStats(id);
			if ('code' in res) {
				if (res.code === 401) {
					if (!(await refreshAuth())) {
						navigate('/login');
					}
					res = await getStats(id);
				}
			}
			setStats(res);
		}
		
		retrieveStats();
	}, [navigate])

	if ('code' in stats) {
		return <p>Error: {String(stats.response)}</p>;
	} 

  return (
    <table className="text-left ">
      <tr>
        <th className="th-stats">Game played: </th>
        <td>{stats.played}</td>
      </tr>
      <tr>
        <th className="th-stats">Winrate: </th>
        <td>
          {(stats.win / stats.played).toPrecision(3)} (W: {stats.win} L:{" "}
          {stats.lose})
        </td>
      </tr>
      <tr>
        <th className="th-stats">Total points recieve:</th>
        <td>{stats.total_points}</td>
      </tr>
      <tr>
        <th className="th-stats">Times tricks choosen</th>
        <td>{stats.nb_trick_choose}</td>
      </tr>
      <tr>
        <th className="th-stats">Prefered tricks</th>
        <td>{stats.prefered_trick}</td>
      </tr>
      <tr>
        <th className="th-stats">Times fold taken</th>
        <td>{stats.nb_taken}</td>
      </tr>
      <tr>
        <th className="th-stats">Times last fold taken</th>
        <td>{stats.nb_last_take}</td>
      </tr>
      <tr>
        <th className="th-stats">Total hand meld points: </th>
        <td>{stats.hand_meld_points}</td>
      </tr>
      <tr>
        <th className="th-stats">Total board meld points: </th>
        <td>{stats.board_meld_points}</td>
      </tr>
      <tr>
        <th className="th-stats">Highest hand meld</th>
        <td>{stats.highest_hand_meld}</td>
      </tr>
      <tr>
        <th className="th-stats">Highest board meld</th>
        <td>{stats.highest_board_meld}</td>
      </tr>
      <tr>
        <th className="th-stats">Total hosting game</th>
        <td>{stats.nb_host}</td>
      </tr>
    </table>
  );
}
