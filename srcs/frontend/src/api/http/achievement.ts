import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'
import type { achievementRetT } from '../../utils/type/achievementApiType';
import type { userLB, achievementT, currentLB } from '../../utils/type/achievementType';

export async function getAchievement(logged_in:boolean) { //: Promise<friendT | errorT>
	
	try {
		let res;
		if (logged_in) { 
			res = await axios.get(host.http + 'achievements/', { timeout: 2000, withCredentials: true});
			return res;
		}
		res = await axios.get(host.http + 'achievements/', {timeout: 2000, withCredentials: true});
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

export function achievementArray(board:AxiosResponse<achievementRetT>) {
	const data = board.data.achievement;
	const achievementarr:userLB[] = [];
	for (const board_data of data) {
		const user:userLB = {
			username: board_data.username,
			score: board_data.elo,
			id: board_data.id,
		}
		achievementarr.push(user);
	}
	let curr:currentLB = {username:"", score:0, rank:0};
	if (board.data.user_rank) {
		curr = {username:board.data.user_rank.username, score:board.data.user_rank.elo, rank:board.data.user_rank.rank};
	}
	const res:achievementT = {achievement: achievementarr, current: curr};
	return res;
}
