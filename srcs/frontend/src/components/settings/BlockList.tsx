import { useRef, useState } from "react";
import generateFakeBlockList from "../../utils/test_funcs/generateFakeBlocklist";
import { changeHandler } from "../../api/friend";

export default function BlockList() {
  const blocklist = generateFakeBlockList();
  const confirmUnblockRef = useRef<HTMLDialogElement>(null);
  const [updatedBlocked, setUpdatedBlocked] = useState(false);

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
                  <a className="link-hover">{blocked.username}</a>
                </td>
                <td>{blocked.blocket_at.getFullYear()}</td>
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
                                blocked.blocked_id,
                                "unblocked",
                                updatedBlocked,
                                setUpdatedBlocked,
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
