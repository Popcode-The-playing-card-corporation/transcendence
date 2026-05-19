import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { statisticsT } from '../utils/statisticsType';

export async function getStats(id:number) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get(host.http + 'user/' + id + '/stats/', { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
		const ret_val:statisticsT = res.data;
		return ret_val;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}
