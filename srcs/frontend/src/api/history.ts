import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { historyT } from '../utils/historyType';
import type { historyApiT } from '../utils/historyApiType';
import type { playerT } from '../utils/playerType';

export async function getHistory() {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get(host.http + 'history/', { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

async function getPlayers(uuid:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get(host.http + 'room/' + uuid + '/', { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

async function playerArray(players:AxiosResponse<playerT[]>) {
	const data = players.data;
	const player_arr: playerT[] = [];
	for (const player_data of data) {
		const player:playerT = player_data;
		player_arr.push(player);
	}
	return player_arr;
}

export async function historyArray(friends:AxiosResponse<historyApiT[]>) {
	const data = friends.data;
	const history_arr: historyT[] = [];
	for (const history_data of data) {
		const res = await getPlayers(history_data.uuid);
		let playerArr:playerT[] = [];
		if (!('code' in res)) {
			playerArr = await playerArray(res);
		}
		
		const history:historyT = {
			game_id: history_data.game_id,
			start: history_data.start,
			points: history_data.points,
			duration: history_data.duration,
			nb_player: history_data.nb_player,
			rank: history_data.rank,
			won: history_data.rank === 1? true : false,
			players: playerArr,
		}
		history_arr.push(history);
	}
	return history_arr;
}