import { useState } from "react";
import type { accountT } from "../utils/accountType";
import { generateFakeHistory } from "../utils/generateTestHistory";
import type { historyT } from "../utils/historyType";

export function History() {
  const gameHistory = generateFakeHistory();
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(10)


  function handleMoreLessBtn() {
	  if (isMore) {
		  setIsMore(false);
		  setNbSlice(10);
	  }
	  else {
		  setIsMore(true);
		  setNbSlice(gameHistory.length)
	  }
  }
  return (
    <table className="mt-5 table-auto">
      <tr>
        <th className="th-history">Game ID</th>
        <th className="w-40 text-left">Date</th>
        <th className="th-history">Your points</th>
        <th className="th-history">Your result</th>
        <th className="th-history">Time played</th>
        <th className="th-history">Nb players</th>
        <th className=" w-100 text-left overflow-hidden">Opponents</th>
      </tr>
      {gameHistory.slice(0, nbSlice).map((game: historyT) => (
        <tr
          className={
            (game.winned ? "bg-(--green-color)" : "bg-(--accent-color)") +
            " text-black h-16 border-b-2 border-(--bg-color)"
          }
        >
          <td>
            <p className="ml-2">{game.gameId} </p>
          </td>
          <td>{game.date}</td>
          <td>{game.points}</td>
          <td>{game.winned ? "winner" : "looser"}</td>
          <td>{game.timePlayed}</td>
          <td>{game.nbPlayers}</td>
          <td>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="link hover:scale-110 hover:text-(--hover-color) transition-all"
              >
                Click to see
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-(--hover-color) rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {game.players.map((player: accountT) => (
                  <li>
                    <a className="text-(--font-color)">{player.username}</a>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      ))}
      <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
        {isMore ? "Show less" : "Show more"}
      </a>
    </table>
  );
}
