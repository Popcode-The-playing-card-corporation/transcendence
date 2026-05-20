import { useState, useEffect } from "react";
import type { historyT } from "../utils/historyType";
import type { errorT } from "../utils/errorType";
import { getHistory, historyArray } from "../api/history";
import type { playerT } from "../utils/playerType";
import { useNavigate } from "react-router-dom";
import { refreshAuth } from "../api/checkAuth";

export function MiniHistory() {
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(10);
  const [gameHistory, setHistory] = useState<historyT[] | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function retrieveHistory() {
      let res = await getHistory();
      if ("code" in res) {
        if (res.code === 401) {
          if (!(await refreshAuth())) {
            navigate("/login");
          }
          res = await getHistory();
        }
        if ("code" in res) {
          setHistory(res);
        } else {
          const arr = await historyArray(res);
          setHistory(arr);
        }
      } else {
        const arr = await historyArray(res);
        setHistory(arr);
      }
    }

    retrieveHistory();
  }, [navigate]);

  if ("code" in gameHistory) {
    return <p>Error: {String(gameHistory.response)}</p>;
  }

  function handleMoreLessBtn() {
    if ("code" in gameHistory) {
      return;
    }
    if (isMore) {
      setIsMore(false);
      setNbSlice(10);
    } else {
      setIsMore(true);
      setNbSlice(gameHistory.length);
    }
  }
  return (
    <div
      className="collapse collapse-arrow bg-(--bg-color) border-(--hover-color) border"
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
        <table className="mt-5 table-auto">
          <tr>
            <th className="w-40 text-left">Date</th>
            <th className="th-history">Points</th>
            <th className="th-history">Result</th>
            <th className="th-history">Time played</th>
            <th className="th-history">Nb players</th>
            <th className=" w-100 text-left overflow-hidden">Opponents</th>
          </tr>
          {gameHistory.slice(0, nbSlice).map((game: historyT) => (
            <tr
              className={
                (game.won ? "bg-(--green-color)" : "bg-(--accent-color)") +
                " text-black h-16 border-b-2 border-(--bg-color)"
              }
            >
              <td>{game.start}</td>
              <td>{game.points}</td>
              <td>{game.won ? "winner" : "loooser"}</td>
              <td>{game.duration}</td>
              <td>{game.nb_player}</td>
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
                    {game.players.map((player: playerT) => (
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
            {gameHistory.length > 10? (isMore ? "Show less" : "Show more") : ""}
          </a>
        </table>
      </div>
    </div>
  );
}
