import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { errorT } from '../utils/errorType';
import host from '../api/host'
import type { friendT } from '../utils/friendType';
import type { friendApiT } from '../utils/friendApiType';

export async function getFriends() { 
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get('http://' + host.host_ip + ':8000/friends/', { 'headers': { 'Authorization': AuthStr}});
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

export function friendArray(friends:AxiosResponse<friendApiT[]>) {
	const data = friends.data;
	const friend_arr: friendT[] = [];
	for (const friend_data of data) {
		const friend:friendT = {
			id: friend_data.user.id,
			username: friend_data.user.username,
			status: friend_data.status,
			date:friend_data.accepted_at,
			online: friend_data.user.is_online,
		}
		friend_arr.push(friend);
	}
	return friend_arr;
}
	


export async function friendRequest(id:number) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post('http://' + host.host_ip + ':8000/friends/add/' + id + '/',{ 'token': localStorage.getItem('access')}, { 'headers': { 'Authorization': AuthStr}});
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
