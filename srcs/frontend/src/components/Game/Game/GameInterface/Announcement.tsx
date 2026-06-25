import { useRef, useState } from "react";
// import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";
import { useGame } from "../../context/GameContext";
import generateDeck from "../../../../utils/createDeck";
import { GrAnnounce } from "react-icons/gr";


export default function Announcement() {
  const isFirstFold = true;
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const { state, annonces } = useGame();
  const annonces_list = state.game.self_cards.melds;
  const [checkedAnnonces, setCheckedAnnonces] = useState<number[]>([]);
  const deck = generateDeck();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const showConfirmAnnonceRef = useRef<HTMLDialogElement>(null);

	function toggleAnnonce(index: number) {
		setCheckedAnnonces((prev) => {
			if (prev.includes(index)) {
			return prev.filter((i) => i !== index);
			}

			return [...prev, index];
		});
	}

  function updateAnnonces() {
    let res : {cardId:number}[] = [];
      const selectedAnnonces = checkedAnnonces.map((index) => annonces_list[index]);
    for (const cards of selectedAnnonces) {
      for (const card of cards.cards) {
        res = [...res, {cardId: card}];
      }
    }
    showConfirmAnnonceRef.current?.close();
    showAnnonceRef.current?.close();
    annonces(res);
    setIsConfirmed(true);
  };

  return (
    <>
      <button
        className={"btn btn-lg btn-circle bg-base-100" + (isFirstFold ? "" : "btn-disabled")}
        onClick={() => showAnnonceRef.current?.showModal()}
      >
        <GrAnnounce />
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
            {annonces_list.map((annonce, index) => {
              if (!annonce.cards[0]) {
                return null;
              }
              let type = "";
              let color = "";
              let cards = "";
              if (deck[annonce.cards[0]].color !== deck[annonce.cards[1]].color) {
                type = "4 of a kind";
                cards = "4 " + deck[annonce.cards[0]].value + "s";
              } else {
                type = String(annonce.cards.length) + " card suite";
                if (deck[annonce.cards[0]].color === "heart") {
                  color = "of hearts";
                } else if (deck[annonce.cards[0]].color === "spade") {
                  color = "of spades";
                } else if (deck[annonce.cards[0]].color === "diamond") {
                  color = "of diamonds";
                } else {
                  color = "of clubs";
                }
                for (const card of annonce.cards) {
                  cards = cards.concat(deck[card].value + ", ")
                }
                cards = cards.slice(0, -2);
              }
              return (
                <tr>
                  <td>
                    <label className="flex  h-5 w-5 items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-(--bg-color)"
                        checked={checkedAnnonces.includes(index)}
                        onChange={() => toggleAnnonce(index)}
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                      </span>
                    </label>
                  </td>
                  <td >
                    <p>{type}</p>
                  </td>
                  <td>
                    {cards} {color}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isConfirmed ? null : 
          <div className="flex items-center justify-center col-span-3 pt-6">
            <button className="btn" onClick={() => showConfirmAnnonceRef.current?.showModal()}>Confirm</button>
          </div>
        }
          <dialog
            id="confirmAnnonce"
            className="modal"
            ref={showConfirmAnnonceRef}
          >
            <div className="modal-box bg-(--bg-color)">
              <h4 className="font-bold ">Are you sure you want to confirm ?</h4>
              <div className="pb-6">
                <br/>
                You won't be able to change or add the annonces.
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn" onClick={updateAnnonces}>Confirm</button>
                <button className="btn" onClick={() => showConfirmAnnonceRef.current?.close()}>Cancel</button>
              </div>
            </div>
          </dialog>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
      </dialog>
    </>
  );
}
