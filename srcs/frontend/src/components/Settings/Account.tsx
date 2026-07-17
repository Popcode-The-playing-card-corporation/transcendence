import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useNotif } from "../hooks/useNotif";
import { deleteAccount } from "../../api/http/profile";
import { useAuth } from "../hooks/useAuth";
import { PswdChange } from "../Profile/PswdChange";
import { PseudoChange } from "../Profile/PseudoChange";
import { logout } from "../../api/http/login";

export default function Account() {

	const confirmDeleteRef = useRef<HTMLDialogElement>(null);
	const navigate = useNavigate();
	const notif = useNotif();
	const auth = useAuth();
	const dialogPswdRef = useRef<HTMLDialogElement>(null);
	const dialogPseudoRef = useRef<HTMLDialogElement>(null);
	const current_location = useLocation();

	function logout_handler() {
		auth.setHasFriendRequest(false);
		navigate("/login", { state: current_location.pathname });
	}

	async function handleLogout() {
		auth.setLogging(true);
		const res = await logout();
		if (res.code !== 200 && res.code !== 401) {
			auth.setLogging(false);
			return;
		}
		auth.setLoggedIn(false);
		localStorage.removeItem("code");
		auth.setUserID(null);
		logout_handler();
		setTimeout(() => {
			auth.setLogging(false);
		}, 500);
	}

	async function handleDelete() {
		const res = await deleteAccount();
		if (res.code === 200) {
			handleLogout();
			navigate('/');
			notif?.showNotif("Account Deleted", "Your account has been successfully deleted.", 5000);
		} else {
			notif?.showNotif("Account Deletion Error", res.response, 5000);
		}
	}
	return (
		<div>
			<div className="flex flex-col w-2/3 mx-auto gap-4 text-center max-xs:items-center">
				<h3>Personal information</h3>
				{auth.has_pass ? <button className="btn " onClick={() => dialogPswdRef.current?.showModal()}>Change password</button> : null}
				<dialog
					id="change_pswd_modal"
					className="modal"
					ref={dialogPswdRef}
				>
					<PswdChange dialogRef={dialogPswdRef} />
				</dialog>
				<button className="btn" onClick={() => dialogPseudoRef.current?.showModal()} >Change username</button>
				<dialog
					id="change_pseudo_modal"
					className="modal"
					ref={dialogPseudoRef}
				>
					<PseudoChange dialogRef={dialogPseudoRef} has_pass={auth.has_pass} updatedProfile={null} setUpdate={null} old_user={null} />
				</dialog>
				<button
					onClick={() => confirmDeleteRef.current?.showModal()}
					className="btn"
				>
					Delete Account
				</button>
				<dialog id="modal_confirm_del" className="modal " ref={confirmDeleteRef}>
					<div className="modal-box bg-(--bg-color)">
						<h3 className="font-bold text-lg">Are you sure you want to delete your account?</h3>
						<div className="modal-action">
							<form method="dialog">
								<button className="btn mr-5 del" onClick={handleDelete}>Yes</button>
								<button className="btn">No</button>
							</form>
						</div>
					</div>
				</dialog>
			</div>
		</div>
	);
}
