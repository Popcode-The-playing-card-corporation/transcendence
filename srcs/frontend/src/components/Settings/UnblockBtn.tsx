import { useRef } from "react";
import { MdBlock } from "react-icons/md";
import { changeHandler } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";

type Props = {
  req_id: number;
  updatedBlocked: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  profileRef: React.RefObject<HTMLDialogElement | null> | null;
};

export default function UnblockBtn({
  req_id,
  updatedBlocked,
  setUpdate,
  profileRef,
}: Props) {
  const confirmUnblocklRef = useRef<HTMLDialogElement>(null);
  const notif = useNotif();

  return (
    <div>
      <button
        onClick={() => confirmUnblocklRef.current?.showModal()}
        className="btn del"
      >
        {" "}
        <MdBlock />{" "}
      </button>
      <dialog
        id="modal_confirm_unblock"
        className="modal "
        ref={confirmUnblocklRef}
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
                  changeHandler(req_id, "unblock", updatedBlocked, setUpdate, profileRef, notif)
                }
              >
                Confirm
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

