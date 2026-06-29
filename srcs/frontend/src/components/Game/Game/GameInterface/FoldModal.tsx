import { useRef } from "react";
import { GiCardPlay } from "react-icons/gi";
import CardImg from "./CardImg";
import { useGame } from "../../context/GameContext";
import { IoIosClose } from "react-icons/io";
// import { useGame } from "../../context/GameContext";

export default function FoldModal() {
  const { state } = useGame();
  const lastFold = state.game.boardData.last_fold;
  const takenBy = lastFold.username;
  const lastFoldRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        className={"btn btn-lg btn-circle bg-base-100"}
        onClick={() => lastFoldRef.current?.showModal()}
      >
        <GiCardPlay />
      </button>
      <dialog id="endingGame" className="modal text-center" ref={lastFoldRef}>
        <div className="modal-box bg-(--bg-color)">
          <h2 className="mb-4">Last fold</h2>
          <p>{lastFold.cards ? `Taken by ${takenBy}` : ""}</p>
          <div className=" flex gap-2 my-6 flex-wrap justify-center bg-secondary rounded-2xl p-2">
            {lastFold.cards ? (
              lastFold.cards.map((card) => {
                return <CardImg name={card.value + card.color} />;
              })
            ) : (
              <p>No cards to display, it's the first round!</p>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex justify-between w-full">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => lastFoldRef.current?.close()}
              >
                <IoIosClose className="text-2xl"/>
              </button>
            </form>
          </div>
        </div>
		<form method="dialog" className="modal-backdrop">
		<button>Close</button>
		</form>
      </dialog>
    </div>
  );
}
