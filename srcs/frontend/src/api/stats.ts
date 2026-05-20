import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { statisticsT } from '../utils/statisticsType';

export async function getStats(id:number) {
	try {
		const res = await axios.get(host.http + 'user/' + id + '/stats/', {timeout: 2000, withCredentials:true});
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
