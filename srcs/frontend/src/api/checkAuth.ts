import axios, { AxiosError } from 'axios'
import host from '../api/host'
import { type errorT, type backendErrorT, getError } from '../utils/errorType';
import { logging_out, setLoggedIn } from './login_status';

export async function refreshAuth() : Promise<boolean> {
	if (logging_out)
		return false;
	try {
		await axios.post(host.http + 'api/token/refresh/', {}, {timeout: 2000, withCredentials: true });
		return true;
	} catch {
		return false;
	}
}

export async function checkAuth() : Promise<boolean> {
	if (logging_out)
		return false;
	try {
		await axios.get(host.http + 'api/token/verify/', {timeout: 2000, withCredentials: true });
		setLoggedIn(true);
		return true;
	} catch {
		const res = await refreshAuth();
		if (!res) {
			setLoggedIn(false);
			return false;
		}
		setLoggedIn(true);
		return true;
	}
}

export async function checkPass(old_pass:string) : Promise<errorT> {
	try {
		const res = await axios.post(host.http + 'user/verify/',{ 'password':old_pass}, { timeout: 2000, withCredentials: true});
		if (res.data.valid === false) {
			return {code:-1, response:"Wrong Password!"};
		}
		return {code:200, response:""};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function check2Pass(pass1:string, pass2:string) : Promise<errorT> {
	try {
		const res = await axios.post(host.http + 'user/check/',{ 'password':pass1, 'password2':pass2}, { timeout: 2000, withCredentials: true});
		if (res.data.valid === false) {
			return {code:-1, response:"New passwords don't match!"};
		}
		return {code:200, response:""};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

