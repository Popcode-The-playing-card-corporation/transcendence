import { useRef } from "react";
import { useNavigate } from "react-router";
import { useNotif } from "../hooks/useNotif";
import { deleteAccount } from "../../api/http/profile";
import { PseudoChange } from "../Profile/PseudoChange";

export default function Account() {

 const confirmDeleteRef = useRef<HTMLDialogElement>(null);
 const navigate = useNavigate();
 const notif = useNotif();

	async function handleDelete() {
		const res = await deleteAccount();
		if (res.code === 200) {
			navigate('/');
			notif?.showNotif("Account Deleted", "Your account has been successfully deleted.", 5000);
		} else {
			notif?.showNotif("Account Deletion Error", res.response, 5000);
		}
	}
  return (
    <div>
      <div className="flex flex-col w-1/3 mx-auto gap-4">
        <h3>Personnal information</h3>
        <button className="btn">Change password</button>
        <button className="btn" >Change username</button>
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
			  <button className="btn mr-5" onClick={handleDelete}>Yes</button>
			  <button className="btn">No</button>
			</form>
		  </div>
		</div>
	  </dialog>
      </div>
	  <div>
	  <h3>Privacy and Security</h3>
	  <p>Not implemented, fucked you (and the capitalism btw)</p>
	  </div>
    </div>
  );
}
