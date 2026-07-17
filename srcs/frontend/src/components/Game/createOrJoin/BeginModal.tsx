import { useEffect, useRef, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function BeginModal() {
  const beginModal = useRef<HTMLDialogElement>(null);
  const [displayBeginModal, setDisplayBeginModal] = useState<string | null>(
    localStorage.getItem("displayBeginModal") ?? "yes",
  );

  useEffect(() => {
    if (
      displayBeginModal === "yes" ||
      displayBeginModal?.length === 0 ||
      displayBeginModal
    ) {
      if (displayBeginModal !== "no" || !displayBeginModal)
        beginModal.current?.showModal();
    }
    function handleModal() {
      if (window.innerWidth < 1024) beginModal.current?.close();
    }
    window.addEventListener("resize", handleModal);
    handleModal();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "displayBeginModal",
      displayBeginModal ? displayBeginModal : "",
    );
  }, [displayBeginModal]);

  return (
    <div className="max-lg:hidden">
      <button
        className="btn btn-secondary btn-circle absolute top-27 right-10 z-10"
        onClick={() => beginModal.current?.showModal()}
      >
        <IoMdInformationCircleOutline />
      </button>
      <dialog
        id="endingGame"
        className="modal text-center"
        ref={beginModal}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <div className="modal-box bg-(--bg-color)">
          <h2>Ready for your first game?</h2>
          <p>Some important information before playing:</p>
          <br />
          <ul className="list-disc mx-4">
            <li>
              You have <strong>15 seconds</strong> to play a card, if you don't
              play in this time a bot plays for you.
            </li>
            <li>
              Your time is increased to <strong>30 seconds </strong>
              for the first fold of each round.
            </li>
            <li>
              If a bot plays <strong>3 times in a row for you</strong>, you will
              be kicked from the game.
            </li>
            <li>
              You can find more information by clicking on the{" "}
              <IoMdInformationCircleOutline className="inline" /> in game, or in
              the rules page.
            </li>
            <li>
              You can display this window again by clicking on the{" "}
              <IoMdInformationCircleOutline className="inline" /> in this page.
            </li>
          </ul>
          <label className="label mt-4">
            <input
              type="checkbox"
              className="checkbox"
              defaultChecked={displayBeginModal === "no" ? true : false}
              onChange={() =>
                setDisplayBeginModal(
                  displayBeginModal === "" || displayBeginModal === "yes"
                    ? "no"
                    : "yes",
                )
              }
            />
            Don't show me again
          </label>
          <div className="modal-action">
            <form method="dialog" className="flex justify-center w-full">
              <button className="btn ">Continue</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
