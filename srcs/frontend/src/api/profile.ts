import type { accountT } from '../utils/accountType'
import axios from 'axios'

export async function profileRequest(): Promise<accountT> {
	const AuthStr = 'Bearer ' + localStorage.getItem('access');
	try {
		const res = await axios.get('http://localhost:8000/user/', { 'headers': { 'Authorization': AuthStr}});
		const result : accountT = {
			username: res.data['username'],
			mail: res.data['email'],
			password: res.data['password'],
			avatar: res.data['avatar'],
			date_joined: res.data['date_joined'],
			is_online: res.data['is_online'],
			last_login: res.data['last_login']
		}
		return result;
	} catch {
			const result : accountT = {
			username: "",
			mail:  "",
			password:  "",
			avatar:  "",
			date_joined:  "",
			is_online:  false,
			last_login:  "",
		}
		return result;
	}
}