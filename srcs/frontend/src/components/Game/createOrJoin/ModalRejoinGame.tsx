import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";

export default function ModalRejoinGame() {
  const rejoinModal = useRef<HTMLDialogElement>(null);
  const game = useGame();

  useEffect(() => {
    if (game.state.event === "player_reconnect" && game.state.message === game.state.user)
      rejoinModal.current?.showModal();
  }, [game.state.event]);

  return (
    <div>
      <dialog
        id="endingGame"
        className="modal "
        ref={rejoinModal}
        onKeyDown={(e) => e.preventDefault()}
        onClose={(e) => e.preventDefault()}
      >
        <div>
          <div className="modal-box bg-(--bg-color)">
            <h2 className="text-center">You are in a game!</h2>
            <p className="my-6 text-justify">
              you can rejoin or leave the game definitively
              <br />
              Warning: You can't rejoin this game again if you leave it
            </p>
            <form method="dialog" className="flex justify-between w-full">
              <button className="btn">Resume</button>
              <button className="btn del" onClick={() => game.exitGame()}>
                Leave
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
