import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'

export async function listRooms() {
	try {
		const res = await axios.get(host.http + 'rooms/list/', {timeout: 2000, withCredentials:true});
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

export async function listJoinedRoom() {
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
		const res = await axios.post(host.http + 'room/', {timeout: 2000, withCredentials:true});
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
		const res = await axios.get(host.http + 'room/' + code + '/' + 'add_bot/' + n_bot + '/', {timeout: 2000, withCredentials:true});
		// add difficulty to body
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