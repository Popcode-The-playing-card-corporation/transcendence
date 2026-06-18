import { useRef } from "react";
import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";

export default function Announcement() {
  const isFirstFold = true;
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const annonces = generateFakeAnnonce();

  function updateSettings() {
    console.log("confirmed !");
  }

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
            <th></th>
            <th>Annonce available</th>
            <th>Cards</th>
          </thead>
          <tbody>
            {annonces.map((annonce) => {
              return (
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-(--bg-color)"
                    />
                      </td>
                      <td >
                        <p>{annonce.annonce}</p>
                  </td>
                  <td>
                    {annonce.cards} in {annonce.colour}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-center col-span-3 pt-6">
          <button className="btn" onClick={updateSettings}>Confirm</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
      </form>
      </dialog>
    </>
  );
}