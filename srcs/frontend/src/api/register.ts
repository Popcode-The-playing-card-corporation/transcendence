import type { accessT } from '../utils/accessType'
import axios, { AxiosError } from 'axios';
import host from '../api/host'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';

export async function registerRequest(in_email:string, in_user:string, in_pass:string, in_avatar: string): Promise<accessT | errorT> {
	const formData = new FormData();

	formData.set('email', in_email);
	formData.set('username', in_user);
	formData.set('password', in_pass);
	formData.set('avatar', in_avatar)

	try {

		const res = await axios.post(host.http + 'register/', formData, { timeout: 2000, withCredentials:true});
		const response : accessT = {
			access: res.data.access,
			refresh: res.data.refresh,
		}
		return response;
	} catch (err) {
		console.debug('here');
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

