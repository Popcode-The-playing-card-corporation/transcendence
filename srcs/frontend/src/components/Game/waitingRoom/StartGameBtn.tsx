import { useRef } from "react";
import { useGame } from "../context/GameContext";

export default function StartGameBtn() {
 const confirmStartRef = useRef<HTMLDialogElement>(null);
 const { startGame } = useGame();

  return (
    <div className="flex z-1">
      <button
        onClick={() => confirmStartRef.current?.showModal()}
        className="btn bg-base-100"
      >
        {" "}
        start game
      </button>
      <dialog id="modal_confirm_del" className="modal " ref={confirmStartRef}>
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Are you ready to have fun?</h3>
          <p className="py-4">
            Warning: a massive dose of fun is coming your way
            <br />
            Impossible to step back.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-5" onClick={startGame}>Yes I'm ready to have fun!</button>
              <button className="btn">No, I'm a coward</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
