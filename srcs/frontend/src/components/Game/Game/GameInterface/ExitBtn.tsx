import { useRef } from "react";
import { IoMdExit } from "react-icons/io";

export default function ExitBtn() {
  const confirmExitModal = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        onClick={() => confirmExitModal.current?.showModal()}
        className="btn btn-circle del "
      >
        {" "}
        <IoMdExit />{" "}
      </button>
      <dialog id="modal_confirm_del" className="modal " ref={confirmExitModal}>
        <div className="modal-box bg-(--bg-color)">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            Are you sure you want exit the game?
            <br />
            You can't rejoin this game after
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn mr-5 del"
                onClick={() => console.log("Game exited!")}
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
