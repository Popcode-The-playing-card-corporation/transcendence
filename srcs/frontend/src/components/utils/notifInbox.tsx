import { IoNotificationsOutline } from "react-icons/io5";
import { useNotif } from "../hooks/useNotif";

export function Notif_Inbox() {

	const notif = useNotif();

	// Sorry I have no idea how to do some stuff right now.
	// TODO:
	// On close of notif needs to call: notif.clearInbox();
	// Make it so clicking notif button closes notif as well
	// Resize notif button
	// Remove that semitransparent outline or make


  return (
	<div className="dropdown dropdown-end">
		<div className="indicator">
		<span
			className={
			"indicator-item badge badge-sm bg-(--nav-color) " +
			(notif?.inbox.length === 0 ? "hidden" : "")
			}
		>
			{notif?.inbox.length}
		</span>

		<button tabIndex={0} className="btn btn-square btn-sm" role="button">
			<IoNotificationsOutline className="text-xl" />
		</button>
		</div>

		<ul
		tabIndex={-1}
		className={
			"dropdown-content menu bg-(--hover-color) rounded-box z-50 mt-2 w-72 max-h-80 overflow-y-auto p-2 shadow " +
			(notif?.inbox.length === 0 ? "hidden" : "")
		}
		>
		{notif?.inbox.map((notification, index) => (
			<li key={index}>
			<div className="block whitespace-normal">
				<p className="font-semibold">{notification.title}</p>
				<p className="text-sm break-words">{notification.message}</p>
			</div>
			</li>
		))}
		</ul>
	</div>
	);
}
