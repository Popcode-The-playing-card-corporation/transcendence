import { useEffect, useRef, useState } from "react";
// import generateFakeBlockList from "../../utils/test_funcs/generateFakeBlocklist";
import { changeHandler, getBlocked } from "../../api/friend";
import { useNotif } from "../hooks/useNotif";
import type { friendT } from "../../utils/friendType";
import type { errorT } from "../../utils/errorType";

export default function BlockList() {
  const [blocklist, setBlocked] = useState<friendT[] | errorT>([]);
  const confirmUnblockRef = useRef<HTMLDialogElement>(null);
  const [updatedBlocked, setUpdatedBlocked] = useState(false);
  const notif = useNotif();
  useEffect(() => {
	
	async function retrieveBlocked() {
		const tmpBlocked = await getBlocked();
		setBlocked(tmpBlocked);
	}
	retrieveBlocked();
  }, [updatedBlocked]);

  if ('code' in blocklist) {
	notif?.showNotif("Unexpected error:", "Error displaying blocked list.", 5000);
	return ;
  }

  return (
    <div className="blocklist my-3 table mx-auto w-fit">
      <table>
        <thead>
          <th>Username</th>
          <th>Blocked at</th>
        </thead>
        <tbody>
          {blocklist.map((blocked) => {
            return (
              <tr>
                <td>
                  <a className="link-hover">{blocked.user.username}</a>
                </td>
                <td>{blocked.blocked_at}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => confirmUnblockRef.current?.showModal()}
                  >
                    Unblock
                  </button>
                  <dialog
                    id="modal_confirm_unblock"
                    className="modal"
                    ref={confirmUnblockRef}
                  >
                    <div className="modal-box bg-(--bg-color)">
                      <h3 className="font-bold text-lg">Are you sure?</h3>
                      <p className="py-4">
                        This user will be able to send you a friend request and
                        play with you in a game
                      </p>

                      <div className="modal-action">
                        <form method="dialog">
                          <button
                            className="btn mr-5 del"
                            onClick={() =>
                              changeHandler(
                                blocked.id,
                                "unblock",
                                updatedBlocked,
                                setUpdatedBlocked,
								null,
								notif,
                              )
                            }
                          >
                            Confirm
                          </button>
                          <button className="btn">Cancel</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
