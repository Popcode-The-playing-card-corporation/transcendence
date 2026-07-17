import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import CardImg from "../GameInterface/CardImg";
import { type annonceT } from "../../../../utils/type/boardDataType";

export default function GlobalAnnonce() {
  const { state } = useGame();
  const annonces = state.game.boardData.annonces;
  const [local_annonces, setAnnonces] = useState<annonceT[]>([]);
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const { show_annonces } = useGame();


  useEffect(() => {
    async function handle_annonces() {
      if (state.event === "reveal_announces") {
        setAnnonces(annonces);
        showAnnonceRef.current?.showModal();
      }
    }
    handle_annonces();
  }, [state.event, annonces])

  if (!annonces && (!local_annonces || local_annonces.length === 0)) {
    return null;
  }

  useEffect(() => {
    function handleModal() {
      if (window.innerWidth < 1024)
        showAnnonceRef.current?.close();
    }
    window.addEventListener("resize", handleModal);
    handleModal();
  }, [])

  return (
    <>
      <dialog
        id="showGlobalAnnonce"
        className="modal"
        ref={showAnnonceRef}
      >
        <div className="modal-box max-h-3/4">
          <h3 className="flex justify-center pb-2 overflow-scroll scrollbar-thumb-(--accent-color)">Annonces</h3>
          {local_annonces.map((annonce) => {
            return (
              <div key={local_annonces.indexOf(annonce)}>
                <div className="flex justify-center text-lg">
                  {annonce.username}
                </div>
                {annonce.cards.map((cards) => {
                  return (
                    <div className="flex gap-1 flex-wrap justify-center pb-8 bg-secondary rounded-2xl p-2" key={annonce.cards.indexOf(cards)}>
                      {
                        cards.map((card) => {
                          return (
                            <CardImg name={card.value + card.color} key={card.id} />
                          );
                        })
                      }
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={show_annonces}>
          <button ></button>
        </form>
      </dialog>
    </>
  );
}
