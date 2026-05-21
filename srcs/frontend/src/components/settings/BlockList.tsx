import { useRef } from "react";
import generateFakeBlockList from "../../utils/test_funcs/generateFakeBlocklist";

export default function BlockList() {
  const blocklist = generateFakeBlockList();
  const confirmUnblockRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="blocklist my-3 table mx-auto w-fit">
      <table>
        <thead>
          <th>Username</th>
          <th>Blocked at</th>
        </thead>
        <tbody>
          {blocklist.map((blocked) => {
			const tst = useRef<HTMLDialogElement>(null);


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
                    ref={tst}
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
                            onClick={() => changeHandler(friend.id, "unblock")}
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
        </HTMLDialogElement>
      </table>
    </div>
  );
}
