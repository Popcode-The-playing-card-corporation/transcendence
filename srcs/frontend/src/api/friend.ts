import type { friendT } from '../utils/friendType'
import axios, { AxiosError } from 'axios'
import type { errorT } from '../utils/errorType';
import host from '../api/host'

// export async function profileRequest(): Promise<friendT | errorT> {
// 	const AuthStr = 'Bearer ' + localStorage.getItem('access');
// 	try {
// 		const res = await axios.get('http://' + host.host_ip + ':8000/user/', { 'headers': { 'Authorization': AuthStr}});
// 		const result : friendT = {
// 			username: res.data['username'],
// 			email: res.data['email'],
// 			password: res.data['password'],
// 			avatar: res.data['avatar'],
// 			date_joined: res.data['date_joined'],
// 			is_online: res.data['is_online'],
// 			last_login: res.data['last_login']
// 		}
// 		return result;
// 	} catch (err) {
// 		const error = err as AxiosError;
// 		// console.error('profile error:', error.status);
// 		const result: errorT = {
// 			code: error.status ? error.status : 0,
// 			response: error.response ? error.response.data : '',
// 		}
// 		return result;
// 	}
// }
