import { generateFakeAccount } from "../utils/test_funcs/generateTestAccount";
import { AvatarSelection } from "./AvatarSelection";

export default function MiniProfile() {
	const fakeAccount = generateFakeAccount();

	return (
	  <dialog>
		<div className="avatar mt-8 flex-col">
			<AvatarSelection currentAvatar={fakeAccount.avatar} />
			<p className="text-green-200 font-extrabold my-2 mx-auto">
			{fakeAccount.is_online ? "Online" : ""}
			</p>
		</div>
	  </dialog>
	);
}