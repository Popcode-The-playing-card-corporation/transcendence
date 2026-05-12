import axios, { AxiosError } from 'axios'
import type { errorT } from '../utils/errorType';
import host from '../api/host'
import type { statisticsT } from '../utils/statisticsType';

export async function getStats(id:number) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get('http://' + host.host_ip + ':8000/user/' + id + '/stats/', { 'headers': { 'Authorization': AuthStr}});
		const ret_val:statisticsT = res.data;
		return ret_val;
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
