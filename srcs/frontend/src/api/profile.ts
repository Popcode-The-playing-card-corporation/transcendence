import type { accountT } from '../utils/accountType'
import axios, { AxiosError } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import avatar1 from "../assets/avatars/avatar1.png";

export async function profileRequest(): Promise<accountT | errorT> {
	try {
		const res = await axios.get(host.http + 'user/', { timeout: 2000, withCredentials: true});
		const result : accountT = res.data;
		if (result.avatar === "")
			changeAvatar(avatar1);
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

export async function changeUsername(in_user:string, old_pass:string, has_pass:boolean) {

	const formData = new FormData();
	formData.set('username', in_user);
	if (has_pass) formData.set('password', old_pass);

	try {
		await axios.patch(host.http + 'user/', formData, { timeout: 2000, withCredentials: true});
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


	const formData = new FormData();
	formData.set('old_password', old_pass);
	formData.set('new_password', in_pass);
	formData.set('new_password2', re_pass);

	try {
		await axios.patch(host.http + 'user/pswd/', formData, {timeout: 2000, withCredentials: true});
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
	const formData = new FormData();
	formData.set('avatar', in_avatar);

	try {
		await axios.patch(host.http + 'user/', formData, { timeout: 2000, withCredentials: true});
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

