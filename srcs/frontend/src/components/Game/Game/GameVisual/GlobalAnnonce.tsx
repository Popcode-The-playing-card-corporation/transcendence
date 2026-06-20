import { useEffect, useRef, useState } from "react";
import generateFakeAnnonce from "../../../../utils/test_funcs/generateFakeAnnonce";
import { useGame } from "../../context/GameContext";

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
          <div className="modal-box bg-(--nav-color)">
          {annonces.map((annonce) => {
            console.debug(state.game.boardData.player_list[String(annonce.room_id)].user.username);
            return(
              <>
                {state.game.boardData.player_list[String(annonce.room_id)].user.username}
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