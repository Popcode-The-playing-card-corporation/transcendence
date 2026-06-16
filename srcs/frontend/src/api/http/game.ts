import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'
import type { availableGameT } from '../../utils/type/availableGameType'

export async function listRooms() {
	try {
		const res = await axios.get(host.http + 'rooms/list/', {timeout: 2000, withCredentials:true});
		const ret:availableGameT[] = res.data;
		return ret;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function getJoinedRoom() {
	try {
		const res = await axios.get(host.http + 'rooms/my/', {timeout: 2000, withCredentials:true});
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

export async function createRoom() {
	try {
		const res = await axios.post(host.http + 'room/', {}, {timeout: 2000, withCredentials:true});
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

export async function addBot(code:number, n_bot:number, dif:string) {
	try {
		const res = await axios.post(host.http + 'room/' + code + '/' + 'add_bot/' + n_bot + '/', {'difficulty':dif}, {timeout: 2000, withCredentials:true});
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

export async function updateParams(code:number, params:string) {
	try {
		const res = await axios.post(host.http + 'room/params/' + code + '/', params, {timeout: 2000, withCredentials:true});
		// add params to body
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