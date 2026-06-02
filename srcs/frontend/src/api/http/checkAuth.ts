import axios from 'axios'
import host from './host'

export async function refreshAuth() : Promise<boolean> {
	try {
		await axios.post(host.http + 'api/token/refresh/', {}, {timeout: 2000, withCredentials: true });
		return true;
	} catch {
		return false;
	}
}

export async function checkAuth() : Promise<boolean> {
	try {
		await axios.get(host.http + 'api/token/verify/', {timeout: 2000, withCredentials: true });
		return true;
	} catch {
		const res = await refreshAuth();
		if (!res) {
			return false;
		}
		return true;
	}
}

