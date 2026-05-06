import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { errorT } from '../utils/errorType';
import host from '../api/host'
import type { leaderboardRetT } from '../utils/leaderboardApiType';
import type { userLB, leaderboardT, currentLB } from '../utils/leaderboardType';

export async function getLeaderboard() { //: Promise<friendT | errorT>
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get('http://' + host.host_ip + ':8000/leaderboard/', { 'headers': { 'Authorization': AuthStr}});
		return res;
	} catch (err) {
		const error = err as AxiosError;
		// console.error('profile error:', error.status);
		const result: errorT = {
			code: error.status ? error.status : 0,
			response: error.response ? error.response.data : '',
		}
		return result;
	}
}

export function leaderboardArray(board:AxiosResponse<leaderboardRetT>) {
	const data = board.data.leaderboard;
	const leaderboardarr:userLB[] = [];
	for (const board_data of data) {
		const user:userLB = {
			username: board_data.username,
			score: board_data.elo,
			id: board_data.id,
		}
		leaderboardarr.push(user);
	}
	const curr:currentLB = {username:board.data.user_rank.username, score:board.data.user_rank.elo, rank:board.data.user_rank.rank};
	const res:leaderboardT = {leaderboard: leaderboardarr, current: curr};
	return res;
}
