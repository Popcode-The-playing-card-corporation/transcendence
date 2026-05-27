import { FaRegTrashAlt } from "react-icons/fa";
import React, { useRef } from "react";
import { changeHandler } from "../api/friend";

type Props = {
  req_id: number;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  profileRef: React.RefObject<HTMLDialogElement | null> | null;
};

export default function DeleteBtn({req_id, updatedFriends, setUpdate, profileRef}: Props) {
  const confirmDelRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
      onClick={() => confirmDelRef.current?.showModal()}
      className="btn del "
      >
      {" "}
      <FaRegTrashAlt />{" "}
      </button>
      <dialog
      id="modal_confirm_del"
      className="modal "
      ref={confirmDelRef}
      >
      <div className="modal-box bg-(--bg-color)">
        <h3 className="font-bold text-lg">
        Are you sure?
        </h3>
        <p className="py-4">
        Are you sure you want to delete your friend?
        <br />
        You can always add them back.
        </p>
        <div className="modal-action">
        <form method="dialog">
          <button
          className="btn mr-5 del"
          onClick={() => changeHandler(req_id, "delete", updatedFriends, setUpdate, profileRef)}
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

