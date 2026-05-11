import axios from 'axios'
import host from '../api/host'
import status from '../api/login_status'

export async function refreshAuth() : Promise<boolean> {

	try {
		const res = await axios.post('http://' + host.host_ip + ':8000/api/token/refresh/', { 'refresh': localStorage.getItem('refresh')});
		localStorage.setItem('access', res.data['access']);
		status.logged_in = true;
		return true;
	} catch {
		status.logged_in = false;
		localStorage.removeItem('access');
		localStorage.removeItem('refresh');
		return false;
	}
}

export async function checkAuth() : Promise<boolean> {

	try {
		await axios.post('http://' + host.host_ip + ':8000/api/token/verify/', { 'token': localStorage.getItem('access')});
		status.logged_in = true;
		return true;
	} catch {
		const res = await refreshAuth();
		if (!res) {
			status.logged_in = false;
			return false;
		}
		status.logged_in = true;
		return true;
	}
}