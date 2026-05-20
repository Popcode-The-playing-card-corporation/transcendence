import { generateFakeAccount } from "../utils/test_funcs/generateTestAccount";

export default function MiniProfile() {
	const fakeAccount = generateFakeAccount();

	return (
		<div className="modal-box bg-(--nav-color)">
			<div className="avatar flex-col">
				<div className="avatar mt-8 flex-col rounded-4xl w-24">
					<img src={fakeAccount.avatar}></img>
				</div>
				<p className="text-green-200 font-extrabold my-2 mx-auto">
				{fakeAccount.is_online ? "Online" : ""}
				</p>
			</div>
		<table className="mt-5">
			<tr>
			<th className="th-profile">Username:</th>
			<td>{fakeAccount.username}</td>
			</tr>
			<tr>
			<th className="th-profile">Email:</th>
			<td>{fakeAccount.email}</td>
			</tr>
			<tr>
			<th className="th-profile">Joined on:</th>
			<td>{fakeAccount.date_joined}</td>
			</tr>
			<tr>
			<th className="th-profile">Last login:</th>
			<td>{fakeAccount.is_online ? "now" : fakeAccount.last_login}</td>
			</tr>

		</table>
		</div>
	);
}