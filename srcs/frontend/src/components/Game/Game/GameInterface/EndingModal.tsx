import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import LittleLeaderboard from "./LittleLeaderboard";
import DetailledLeaderboard from "./DetailledLeaderboard";

export default function EndingModal({
  isEnd,
  setIsEnd,
}: {
  isEnd: boolean;
  setIsEnd: Dispatch<SetStateAction<boolean>>;
}) {
  const endRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isEnd) endRef.current?.showModal();
    else endRef.current?.close();
  }, [isEnd]);

  return (
    <div>
      <dialog id="endingGame" className="modal text-center" ref={endRef}>
        <div className="modal-box bg-(--bg-color)">
          <h2>Finished!</h2>
          <p>
            The game is finished, you can choose between exit to the game menu
            or continue and join the waiting room
          </p>
          <LittleLeaderboard />
          <DetailledLeaderboard />
          <div className="modal-action">
            <form method="dialog" className="flex justify-between w-full">
              <button className="btn" onClick={() => setIsEnd(false)}>
                Continue
              </button>
              <button className="btn del" onClick={() => setIsEnd(false)}>
                Exit
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
