import { useState } from "react";
import { addBot } from "../../../api/http/game";
import { useNotif } from "../../hooks/useNotif";

export default function AddingBot({roomCode}:{roomCode:string}) {

	const [botDif, setDif] = useState(0);
	const [numBot, setNum] = useState(1);
	const notif = useNotif();

	async function addClick() {
		const res = await addBot(roomCode, numBot, botDif === 0 ? "easy" : botDif === 1 ? "medium" : "hard")
		if ("code" in res) {
			notif?.showNotif("Bot Error", res.response, 5000);
		}
	}

  return (
    <div className="w-full max-w-xs ">
      <input
        type="range"
        min="0"
        max="2"
        value={botDif}
        className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
        step="1" 
		onChange={(e) => setDif(Number(e.target.value))}/>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>Kilian (easy)</span>
        <span>Alex (medium)</span>
        <span>Dana (chiante)</span>
      </div>
	  <div className="numberBots flex gap-3 items-center justify-end mt-5">
		<button
			className="btn btn-sm"
			onClick={() => setNum((prev) => Math.max(1, prev - 1))}
		>-</button>
		<span className="text-xl w-8 text-center">{numBot}</span>
		<button
			className="btn btn-sm"
			onClick={() => setNum((prev) => Math.min(6, prev + 1))}
		>+</button>
		<button className="btn btn-sm" onClick={addClick}>Add</button>
		</div>
    </div>
  );
}
