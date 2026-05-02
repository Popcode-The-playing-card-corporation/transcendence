import type { accessT } from '../utils/accessType'

export async function registerRequest(in_email:string, in_user:string, in_pass:string, in_avatar:string): Promise<accessT | null> {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: in_email, username: in_user, password:in_pass})
	}
	in_avatar = "";
	try {
		const res = await fetch('http://localhost:8000/register/', requestOptions);
		if (!res.ok)
			return null;
		const parse = await res.json();
		const response : accessT = {
			access: parse['access'],
			refresh: parse['refresh'],
		}
		return response;
	} catch (err) {
		console.error('registration error:', err)
		return null;
	}
}
