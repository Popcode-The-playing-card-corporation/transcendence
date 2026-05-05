import status from '../api/login_status'

export async function logout() {
	localStorage.clear();
}