import { checkAuth } from "./checkAuth"

const check = await checkAuth();

export default {
	logged_in: check,
}