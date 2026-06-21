import { useRef } from "react";
import generateFakeLastFold from "../../../../utils/test_funcs/generateFakeLastFold";
import { GiCardPlay } from "react-icons/gi";
import CardImg from "./CardImg";
// import { useGame } from "../../context/GameContext";


export default function FoldModal() {
  // const lastFold = state.game.boardData.last_fold;
  // const { state } = useGame()
  const lastFold = generateFakeLastFold();
  const takenBy = "danouille";
  const lastFoldRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        className={"btn btn-lg btn-circle"}
        onClick={() => lastFoldRef.current?.showModal()}
      >
        <GiCardPlay />
      </button>
      <dialog id="endingGame" className="modal text-center" ref={lastFoldRef}>
        <div className="modal-box bg-(--bg-color)">
          <h2 className="mb-4">Last fold</h2>
          <p>Taken by {takenBy}</p>
          <div className=" flex gap-2 my-6 flex-wrap justify-center">
            {lastFold.map((card) => {
              return <CardImg name={card.value + card.color} />;
            })}
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex justify-between w-full">
              <button
                className="btn mx-auto"
                onClick={() => lastFoldRef.current?.close()}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
