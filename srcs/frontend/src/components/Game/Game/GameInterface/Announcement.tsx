import { useRef } from "react";
import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";

export default function Announcement() {
  const isFirstFold = true;
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const annonces = generateFakeAnnonce();

  function updateSettings() {
    console.log("confirmed !");
  };

  function handleChange() {

  };

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
                      <label className="flex  h-5 w-5 items-center cursor-pointer relative">
                        <input type="checkbox" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-(--bg-color) " id="check" />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </span>
                    </label>
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