import axios from 'axios'
import host from './host'
import type { SetStateAction } from 'react';

export async function checkAuth(setUserID:React.Dispatch<SetStateAction<number | null>>) : Promise<boolean> {

	try {
		const res = await axios.post(host.http + 'api/token/verify/', {}, {timeout: 2000, withCredentials: true });
		if (res.data.status === "success") {
			setUserID(res.data.id)
			return true;
		}
		return false
	} catch {
		return false;
	}
}

