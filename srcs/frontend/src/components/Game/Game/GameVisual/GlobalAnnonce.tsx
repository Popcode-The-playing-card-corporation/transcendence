import { useEffect, useRef, useState } from "react";
import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";
import { useGame } from "../../context/GameContext";
import CardImg from "../GameInterface/CardImg";

export default function GlobalAnnonce() {
  const annonces = generateFakeAnnonce();
  const showAnnonceRef = useRef<HTMLDialogElement>(null);
  const {state} = useGame();
  const { show_annonces } = useGame();

  useEffect(() =>
  {
    if (state.show_annonces)
      showAnnonceRef.current?.showModal();
      
  }, [state.show_annonces])

  return (
    <>
      <button className="btn" onClick={show_annonces}>annonce</button>
        <dialog 
          id="showGlobalAnnonce"
          className="modal"
          ref={showAnnonceRef}
        >
          <div className="modal-box bg-(--nav-color) max-h-3/4">
            <h3 className="flex justify-center pb-2 overflow-scroll scrollbar-thumb-(--accent-color)">Annonces</h3>
            {annonces.map((annonce) => {
              console.debug(state.game.boardData.player_list[String(annonce.room_id)].user.username);
              return(
                <>
                  <div className="flex justify-center text-lg">
                    {state.game.boardData.player_list[String(annonce.room_id)].user.username}
                  </div>
                  <>
                    {annonce.cards.map((cards) => {
                      return(
                        <div className="flex gap-1 flex-wrap justify-center pb-8">
                          {
                            cards.map((card) => {
                              return(
                                <CardImg name={card.value + card.color} />
                              );
                            })
                          }
                        </div>
                      );
                    })}
                  </>
                </>
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