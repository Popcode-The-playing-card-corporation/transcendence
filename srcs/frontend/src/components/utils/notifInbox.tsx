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
			"indicator-item badge bg-(--nav-color)" +
			(notif?.inbox.length === 0 ? " hidden" : "")
			}
		>
			{notif?.inbox.length}
		</span>
		<div tabIndex={0} className="btn" role="button">
			<IoNotificationsOutline />
		</div>
		</div>
		<ul
		tabIndex={-1}
			className={
			"dropdown-content bg-(--hover-color) rounded-box z-1 p-2 shadow-sm h-fit overflow-scroll" +
			(notif?.inbox.length === 0 ? " hidden" : "")
			}
		>
			{notif?.inbox.map((notification) => {
			return (
				<li className="flex w-full my-3" key={notification.title}>
				<div className="flex gap-6 w-full">	
					<div className="username-request flex items-center w-2/3">
					<p>{notification.message}</p>
					</div>
				</div>
				</li>
			);
			})}
		</ul>
	</div>
  );
}
