import type { accountT } from '../utils/accountType'
import axios, { AxiosError } from 'axios'
import type { errorT } from '../utils/errorType';
import host from '../api/host'

export async function profileRequest(): Promise<accountT | errorT> {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get('http://' + host.host_ip + ':8000/user/', { 'headers': { 'Authorization': AuthStr}});
		const result : accountT = res.data;
		return result;
	} catch (err) {
		const error = err as AxiosError;
		// console.error('profile error:', error.status);
		const result: errorT = {
			code: error.status ? error.status : 0,
			response: error.response ? error.response.data : '',
		}
		return result;
	}
}

export async function changeUsername(in_user:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('username', in_user);

	try {
		await axios.patch('http://' + host.host_ip + ':8000/user/', formData, { 'headers': { 'Authorization': AuthStr}});
		return true;
	} catch (err) {
		console.error('update error:', err);
		return false;
	}
}

export async function changeEmail(in_email:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('email', in_email);

	try {
		await axios.patch('http://' + host.host_ip + ':8000/user/', formData, { 'headers': { 'Authorization': AuthStr}});
		return true;
	} catch (err) {
		console.error('update error:', err);
		return false;
	}
}

export async function changeAvatar(in_avatar:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('avatar', in_avatar);

	try {
		await axios.patch('http://' + host.host_ip + ':8000/user/', formData, { 'headers': { 'Authorization': AuthStr}});
		return true;
	} catch (err) {
		console.error('update error:', err);
		return false;
	}
}

export async function changePassword(in_pass:string) {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	const formData = new FormData();
	formData.set('password', in_pass);

	try {
		await axios.patch('http://' + host.host_ip + ':8000/user/', formData, { 'headers': { 'Authorization': AuthStr}});
		return true;
	} catch (err) {
		console.error('update error:', err);
		return false;
	}
}