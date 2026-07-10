import { useState } from "react";
import type { historyT } from "../../utils/type/historyType";
import type { playerT } from "../../utils/type/playerType";
import type { errorT } from "../../utils/type/errorType";

type Props = {
  history: historyT[] | errorT;
};

export function MiniHistory({ history }: Props) {
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(10);

  if ('code' in history) {
    if (history.response === "Forbidden: not friends")
      return <p>Send a friend request to see this person's history!</p>;
    return <p>Error displaying history</p>;
  }

  function handleMoreLessBtn() {
    if ('code' in history) {
      return;
    }
    if (isMore) {
      setIsMore(false);
      setNbSlice(10);
    } else {
      setIsMore(true);
      setNbSlice(history.length);
    }
  }
  return (
    <div
      className="collapse collapse-arrow border border-accent"
    >
      <input id="collapse-1-toggle" type="checkbox" className="peer" />
      <label
        htmlFor="collapse-1-toggle"
        className="fixed inset-0 hidden peer-checked:block"
      ></label>
      <div className="collapse-title font-semibold">
        Show history of Eude
      </div>
      <div className="collapse-content text-sm z-1">
        {history.length === 0 ?
          <div className="text-center">
            <p>This player does not yet have any games in their history!</p>
          </div>
          :
          <table className="mt-5 text-center w-full">
            <tr>
              <th className="">Date</th>
              <th className="th-history">Points</th>
              <th className="th-history">Result</th>
              <th className="th-history">Time played</th>
              <th className="th-history">Nb players</th>
              <th className=" overflow-hidden">Opponents</th>
            </tr>
            {history.slice(0, nbSlice).map((game: historyT) => (

              <tr
                className={
                  (game.won ? "bg-success" : "bg-warning") +
                  " h-16 border-b-2 border-base-100"
                }
              >
                <td>{game.start}</td>
                <td>{game.points}</td>
                <td>{game.won ? "winner" : "loooser"}</td>
                <td>{game.duration + "s"}</td>
                <td>{game.nb_player}</td>
                <td>
                  <div className="dropdown dropdown-center ">
                    <div
                      tabIndex={0}
                      className="link hover:scale-110 transition-all"
                    >
                      Click to see
                    </div>
                    <ul
                      tabIndex={-1}
                      className="dropdown-content rounded-box z-1 p-3 shadow-sm max-w-42 space-y-2"
                    >
                      {game.players.map((player: playerT) => (
                        <li className="w-38 max-w-38">
                          <p className="truncate">
                            {player.username}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
              {history.length > 10 ? (isMore ? "Show less" : "Show more") : ""}
            </a>
          </table>
        }
      </div>
    </div>
  );
}
