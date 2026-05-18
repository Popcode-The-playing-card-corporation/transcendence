import type { accountT } from '../utils/accountType'
import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import { check2Pass, checkPass } from './checkAuth';

export async function profileRequest(): Promise<accountT | errorT> {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get(host.http + 'user/', { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
		const result : accountT = res.data;
		return result;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function changeUsername(in_user:string, old_pass:string) {
	const check = await checkPass(old_pass);
	if (check.code !== 200) {
		return check;
	}
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('username', in_user);

	try {
		await axios.patch(host.http + 'user/', formData, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

export async function changePassword(old_pass:string, in_pass:string, re_pass:string) {

	const check = await checkPass(old_pass);
	if (check.code !== 200) {
		return check;
	}

	const check2 = await check2Pass(in_pass, re_pass)
	if (check2.code !== 200) {
		return check2;
	}

	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('password', in_pass);

	try {
		await axios.patch(host.http + 'user/', formData, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
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

export async function changeAvatar(in_avatar:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('avatar', in_avatar);

	try {
		await axios.patch(host.http + 'user/', formData, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
		return {code:200};
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

// export async function changeEmail(in_email:string) {
// 	const AuthStr = 'Bearer ' + localStorage.getItem('access');
// 	const formData = new FormData();
// 	formData.set('email', in_email);

// 	try {
// 		await axios.patch('http://' + host.host_ip + ':8000/user/', formData, { 'headers': { 'Authorization': AuthStr}, timeout: 2000});
// 		return true;
// 	} catch (err) {
// 		console.error('update error:', err);
// 		return false;
// 	}
// }

