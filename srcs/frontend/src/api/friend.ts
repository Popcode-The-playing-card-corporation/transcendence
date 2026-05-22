import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { friendT } from '../utils/friendType';

export async function getFriends() { 
	try {
		const res = await axios.get(host.http + 'friends/', { timeout: 2000, withCredentials: true});
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

export function friendArray(friends:AxiosResponse<friendT[]>) {
	const data = friends.data;
	const friend_arr: friendT[] = [];
	for (const friend_data of data) {
		const friend:friendT = friend_data;
		friend_arr.push(friend);
	}
	return friend_arr;
}


export async function friendRequest(id:number) {
	try {
		const res = await axios.post(host.http + 'friends/add/' + id + '/',{}, { timeout: 2000, withCredentials: true});
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

export async function changeHandler(req_id: number, func: string, updatedFriends:boolean, setUpdate:React.Dispatch<React.SetStateAction<boolean>>) {
	if (func === "accept") {
		const res = await acceptRequest(req_id);
		if ("code" in res) {
		console.error(res.response);
		}
	} else if (func === "deny") {
		const res = await denyRequest(req_id);
		if ("code" in res) {
		console.error(res.response);
		}
	} else if (func === "delete") {
		const res = await deleteRequest(req_id);
		if ("code" in res) {
		console.error(res.response);
		}
	}
	setUpdate(!updatedFriends);
	return;
}

export async function acceptRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/accept/' + req_id + '/',{}, { timeout: 2000, withCredentials: true });
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

export async function denyRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/deny/' + req_id + '/',{}, { timeout: 2000, withCredentials: true});
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

export async function deleteRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/delete/' + req_id + '/',{}, {timeout: 2000, withCredentials: true});
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