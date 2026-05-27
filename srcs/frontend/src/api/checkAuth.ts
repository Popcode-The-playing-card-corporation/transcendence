import axios from 'axios'
import host from '../api/host'
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

