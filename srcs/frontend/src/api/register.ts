import type { accessT } from '../utils/accessType'
import axios from 'axios';
import host from '../api/host'

export async function registerRequest(in_email:string, in_user:string, in_pass:string, in_avatar: string): Promise<accessT | null> {
	const formData = new FormData();

	formData.set('email', in_email);
	formData.set('username', in_user);
	formData.set('password', in_pass);
	formData.set('avatar', in_avatar)

	try {
		// const img_response = await fetch(in_avatar);
		// const blob = await img_response.blob();
		// const img = new File([blob], "avatar.png", { type: "image/png"});
		// formData.set('avatar', img);
		const res = await axios.post('http://' + host.host_ip + ':8000/register/', formData);
		const response : accessT = {
			access: res.data['access'],
			refresh: res.data['refresh'],
		}
		return response;
	} catch (err) {
		console.error('registration error:', err);
		return null;
	}
}
