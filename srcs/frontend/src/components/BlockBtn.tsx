import { useRef } from "react";
import { MdBlock } from "react-icons/md";
import { changeHandler } from "../api/friend";

type Props = {
  req_id: number;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  changeHandler: (
    req_id: number,
    func: string,
    updatedFriends: boolean,
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
};

export default function BlockBtn({
  req_id,
  changeHandler,
  updatedFriends,
  setUpdate,
}: Props) {
  const confirmBlocklRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        onClick={() => confirmBlocklRef.current?.showModal()}
        className="btn del"
      >
        {" "}
        <MdBlock />{" "}
      </button>
      <dialog
        id="modal_confirm_block"
        className="modal "
        ref={confirmBlocklRef}
      >
        <div className="modal-box bg-(--bg-color)">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            Are you sure you want to block this user ?
            <br />
            You won't be able to play with them and your profile will be hidden
            from them.
            <br />
            You can always unblock them in settings.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn mr-5 del"
                onClick={() =>
                  changeHandler(req_id, "block", updatedFriends, setUpdate)
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

