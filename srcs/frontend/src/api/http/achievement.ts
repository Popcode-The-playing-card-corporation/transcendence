import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'
import type { achievement, achievementT } from '../../utils/type/achievementType';

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

export function achievementArray(board:AxiosResponse<achievement[]>) {
	const data = board.data;
	const achievementarr:achievement[] = [];
	for (const board_data of data) {
		const achiev:achievement = {
			img: board_data.img,
            title: board_data.title,
            description: board_data.description,
            value: board_data.value,
            max_value: board_data.max_value,
            is_unlock: board_data.is_unlock,
            rate: board_data.rate
		}
		achievementarr.push(achiev);
	}
	const res:achievementT = {achievement: achievementarr};
	return res;
}
