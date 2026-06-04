import { useRef } from "react";
import AnnouncementModal from "./AnnouncementModal";

export default function AnnouncementBtn() {
  const isFirstFold = true;
  const showAnnonceRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={"btn " + (isFirstFold ? "" : "btn-disabled")}
        onClick={() => showAnnonceRef.current?.showModal()}
        >
        Annonces
      </button>
      <dialog
        id="showAnnonce"
        className="modal"
        ref={showAnnonceRef}
      >
        <AnnouncementModal />
      </dialog>
    </>
  );
}