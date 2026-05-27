import type { accessT } from '../utils/accessType'
import host from '../api/host'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import  axios, { AxiosError } from 'axios';

export async function loginRequest(in_name:string, in_pass:string): Promise<accessT | errorT> {

	try {
		const res = await axios.post(host.http + 'login/', { 'username': in_name, 'password': in_pass, timeout: 2000});
		const response : accessT = {
			access: res.data.access,
			refresh: res.data.refresh,
		}
		return response;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}
