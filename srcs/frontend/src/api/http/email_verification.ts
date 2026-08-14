import axios, { AxiosError } from 'axios';
import { getError, type backendErrorT, type errorT } from '../../utils/type/errorType';
import host from './host';

export async function sendVerificationEmail(): Promise<errorT> {
	try {
		await axios.post(host.http + 'email_send/', {}, { timeout: 2000, withCredentials: true});

		return { code: 200, response: "success"};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;

		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		};

		return result;
	}
}

export async function validateToken(searchId: string, token: string): Promise<errorT> {
	try {
		await axios.post(host.http + 'token_verify/', {id: searchId, token: token}, { timeout: 2000, withCredentials: true});

		return {
			code: 200,
			response: "success",
		};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;

		return {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		};
	}
}