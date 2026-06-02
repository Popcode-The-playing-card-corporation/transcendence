import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host'
import type { statisticsT } from '../../utils/type/statisticsType';

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
