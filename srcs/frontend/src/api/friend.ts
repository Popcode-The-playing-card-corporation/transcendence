import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { friendT } from '../utils/friendType';

export async function getFriends() { 
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get(host.http + 'friends/', { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post(host.http + 'friends/add/' + id + '/',{ 'token': localStorage.getItem('access')}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

export async function acceptRequest(req_id:number) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post(host.http + 'friends/accept/' + req_id + '/',{ 'token': localStorage.getItem('access')}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post(host.http + 'friends/deny/' + req_id + '/',{ 'token': localStorage.getItem('access')}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post(host.http + 'friends/delete/' + req_id + '/',{ 'token': localStorage.getItem('access')}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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