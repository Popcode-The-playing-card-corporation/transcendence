import axios from 'axios'
import host from './host'

export async function checkAuth() : Promise<boolean> {
	try {
		const res = await axios.post(host.http + 'api/token/verify/', {}, {timeout: 2000, withCredentials: true });
		if (res.data.status === "success")
			return true;
		return false
	} catch {
		return false;
	}
}

