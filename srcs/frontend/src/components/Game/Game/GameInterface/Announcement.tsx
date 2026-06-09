import { useRef } from "react";
import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";

export default function Announcement() {
  const isFirstFold = true;
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const annonces = generateFakeAnnonce();

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
      <div className="modal-box bg-(--nav-color)">
        <table className="table">
          <thead>
            <th>Annonce available</th>
            <th>Cards</th>
          </thead>
          <tbody>
            {annonces.map((annonce) => {
              return (
                <tr>
                  <td >
                    <button className="link-hover">{annonce.annonce}</button>
                  </td>
                  <td>
                    {annonce.cards} in {annonce.colour}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
      </dialog>
    </>
  );
}