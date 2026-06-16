import host from './host'
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import  axios, { AxiosError } from 'axios';
import type { SetStateAction } from 'react';


export async function loginRequest(in_name:string, in_pass:string, setUserID:React.Dispatch<SetStateAction<number | null>>, setPass:React.Dispatch<SetStateAction<boolean>>): Promise<errorT> {
	try {
		const res = await axios.post(host.http + 'login/', { 'username': in_name, 'password': in_pass}, {timeout: 2000, withCredentials: true});
		setUserID(res.data.id);
		setPass(res.data.has_pass)
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

export async function logout(): Promise <errorT> {
	try {
		await axios.post(host.http + 'logout/', {}, {timeout: 2000, withCredentials: true});
		return {code: 200, response: "success"}
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

