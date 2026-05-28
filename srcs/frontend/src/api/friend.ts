import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getError, type backendErrorT, type errorT } from '../utils/errorType';
import host from '../api/host'
import type { friendT } from '../utils/friendType';
import type { profileT } from '../utils/profileType';
import type { NotifContextType } from '../components/contexts/NotifContext';

export async function getFriends() { 
	try {
		const res = await axios.get(host.http + 'friends/', { timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function getBlocked() { 
	try {
		const res = await axios.get(host.http + 'friends/block/', { timeout: 2000, withCredentials: true});
		const result = friendArray(res);
		return result;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function getProfile(id: number) {
	try {
		const res = await axios.get(host.http + 'user/' + id + '/', { timeout: 2000, withCredentials: true});
		const result:profileT = res.data;
		return result;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
} 

export function friendArray(friends:AxiosResponse<friendT[]>) {
	const data = friends.data;
	const friend_arr: friendT[] = [];
	for (const friend_data of data) {
		const friend:friendT = friend_data;
		friend_arr.push(friend);
	}
	return friend_arr;
}


export async function friendRequest(id:number) {
	try {
		const res = await axios.post(host.http + 'friends/add/' + id + '/',{}, { timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function changeHandler(req_id: number, func: string, updatedFriends:boolean, setUpdate:React.Dispatch<React.SetStateAction<boolean>>,   profileRef: React.RefObject<HTMLDialogElement | null> | null, notif: NotifContextType | undefined) {

	if (func === "accept") {
		const res = await acceptRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Accept Error:", "There was an unexpected error accepting the friend request.", 5000)
		} else {
			profileRef?.current?.close();
		}
	} else if (func === "deny") {
		const res = await denyRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Deny Error:", "There was an unexpected error denying the friend request.",5000)
		} else {
			profileRef?.current?.close();
		}
	} else if (func === "delete") {
		const res = await deleteRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Delete Error:", "There was an unexpected error deleting the friend.", 5000)
		} else {
			profileRef?.current?.close();
		}
	} else if (func === "block") {
		const res = await blockRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Block Error:", "There was an unexpected error blocking this individual.", 5000)
		} else {
			profileRef?.current?.close();
		}	
	} else if (func === "unblock") {
		const res = await unblockRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Unblock Error:", "There was an unexpected error unblocking this person.", 5000)
		} else {
			profileRef?.current?.close();
		}
	} else if (func === "request") {
		const res = await friendRequest(req_id);
		if ("code" in res) {
			notif?.showNotif("Request Error:", "There was an unexpected error sending a friend request to this person.")
		} else {
			profileRef?.current?.close();
		}
	}
	setUpdate(!updatedFriends);
	return;
}

export async function acceptRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/accept/' + req_id + '/',{}, { timeout: 2000, withCredentials: true });
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function denyRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/deny/' + req_id + '/',{}, { timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function deleteRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/delete/' + req_id + '/',{}, {timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function blockRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/block/' + req_id + '/',{}, {timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}

export async function unblockRequest(req_id:number) {
	try {
		const res = await axios.post(host.http + 'friends/unblock/' + req_id + '/',{}, {timeout: 2000, withCredentials: true});
		return res;
	} catch (err) {
		const error = err as AxiosError<backendErrorT>;
		const result: errorT = {
			code: error.response?.status ?? 0,
			response: getError(error.response?.data),
		}
		return result;
	}
}