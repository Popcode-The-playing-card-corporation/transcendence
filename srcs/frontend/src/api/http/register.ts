import axios, { AxiosError } from 'axios';
import host from './host'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import type { SetStateAction } from 'react';

export async function registerRequest(in_email:string, in_user:string, in_pass:string, in_avatar: string, setUserID:React.Dispatch<SetStateAction<number | null>>): Promise<errorT> {
	const formData = new FormData();

	formData.set('email', in_email);
	formData.set('username', in_user);
	formData.set('password', in_pass);
	formData.set('avatar', in_avatar)

	try {

		const res = await axios.post(host.http + 'register/', formData, { timeout: 2000, withCredentials:true});
		setUserID(res.data.id)
		return {code:200, response:"success"};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

