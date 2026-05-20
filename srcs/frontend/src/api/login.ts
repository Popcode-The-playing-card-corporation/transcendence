import host from '../api/host'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import  axios, { AxiosError } from 'axios';

export async function loginRequest(in_name:string, in_pass:string): Promise<errorT> {

	try {
		await axios.post(host.http + 'login/', { 'username': in_name, 'password': in_pass}, {timeout: 2000, withCredentials: true});
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

