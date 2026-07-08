import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'
import type { leaderboardRetT } from '../../utils/type/leaderboardApiType';
import type { userLB, leaderboardT, currentLB } from '../../utils/type/leaderboardType';

export async function getLeaderboard(logged_in:boolean) { //: Promise<friendT | errorT>
	
	try {
		let res;
		if (logged_in) { 
			res = await axios.get(host.http + 'leaderboard/', { timeout: 2000, withCredentials: true});
			return res;
		}
		res = await axios.get(host.http + 'leaderboard/', {timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
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
			rank: board_data.rank,
		}
		leaderboardarr.push(user);
	}
	let curr:currentLB = {username:"", score:0, rank:0};
	if (board.data.user_rank) {
		curr = {username:board.data.user_rank.username, score:board.data.user_rank.elo, rank:board.data.user_rank.rank};
	}
	const res:leaderboardT = {leaderboard: leaderboardarr, current: curr};
	return res;
}
