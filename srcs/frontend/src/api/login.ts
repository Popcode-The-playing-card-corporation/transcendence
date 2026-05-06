import type { accessT } from '../utils/accessType'
import host from '../api/host'
import status from '../api/login_status'

export async function loginRequest(in_name:string, in_pass:string): Promise<accessT | null> {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: in_name, password:in_pass})
	}

	try {
		const res = await fetch('http://' + host.host_ip + ':8000/login/', requestOptions);
		if (!res.ok) {
			status.logged_in = false;
			return null;
		}
		const parse = await res.json();
		const response : accessT = {
			access: parse['access'],
			refresh: parse['refresh'],
		}
		status.logged_in = true;
		return response;
	} catch {
		status.logged_in = false;
		return null;
	}
}