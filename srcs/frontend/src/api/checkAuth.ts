import axios, { AxiosError } from 'axios'
import host from '../api/host'
import { type errorT, type backendErrorT, getError } from '../utils/errorType';

export async function refreshAuth() : Promise<boolean> {

	try {
		const res = await axios.post('http://' + host.host_ip + ':8000/api/token/refresh/', { 'refresh': localStorage.getItem('refresh'), timeout: 2000});
		localStorage.setItem('access', res.data['access']);
		return true;
	} catch {
		localStorage.removeItem('access');
		localStorage.removeItem('refresh');
		return false;
	}
}

export async function checkAuth() : Promise<boolean> {

	try {
		await axios.post('http://' + host.host_ip + ':8000/api/token/verify/', { 'token': localStorage.getItem('access'), timeout: 2000});
		return true;
	} catch {
		const res = await refreshAuth();
		if (!res) {
			return false;
		}
		return true;
	}
}

export async function checkPass(old_pass:string) : Promise<errorT> {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post('http://' + host.host_ip + ':8000/user/verify/',{ 'token': localStorage.getItem('access'), 'password':old_pass}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.post('http://' + host.host_ip + ':8000/user/check/',{ 'token': localStorage.getItem('access'), 'password':pass1, 'password2':pass2}, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

