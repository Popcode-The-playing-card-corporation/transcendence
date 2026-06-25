import { useEffect, useRef } from "react";
import LittleLeaderboard from "./LittleLeaderboard";
import DetailledLeaderboard from "./DetailledLeaderboard";
import { useGame } from "../../context/GameContext";

export default function EndingModal() {
  const endRef = useRef<HTMLDialogElement>(null);
  const {state, leaveRoom, continueGame, nextGame} = useGame();

  useEffect(() => {
    if (state.event === "game_finish") endRef.current?.showModal();
  }, [state.event]);

  function handle_continue_host() {
	endRef.current?.close();
	continueGame();
  }

  function handle_continue_user() {
	endRef.current?.close();
	nextGame(state.new_code ? state.new_code : "");
  }


  function handle_exit() {
	endRef.current?.close();
	leaveRoom();
  }

  
  return (
    <div>
      <dialog id="endingGame" className="modal text-center" ref={endRef} onCancel={(e) => e.preventDefault()}>
        <div className="modal-box bg-(--bg-color)">
          <h2>Finished!</h2>
          { state.host === state.user ? <p>Press continue to create a new lobby, press exit to leave the lobby.</p> : state.next === null ? <p>
            Waiting for the host to create a new room ...
          </p> : state.next ? <p>The host has created a new room. Press continue to join it!</p> : <p>The host has left. Press exit to leave the game.</p>}
          <LittleLeaderboard />
          <DetailledLeaderboard />
          <div className="modal-action">
            <form method="dialog" className="flex justify-between w-full">
              { state.host === state.user ? <button className="btn" onClick={handle_continue_host}>
                Continue
              </button> : state.next === true ? <button className="btn" onClick={handle_continue_user}>
                Continue
              </button> : null}
              <button className="btn del" onClick={handle_exit}>
                Exit
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
