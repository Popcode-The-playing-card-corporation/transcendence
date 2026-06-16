import { useState } from "react";
import type { historyT } from "../../utils/type/historyType";
import type { playerT } from "../../utils/type/playerType";
import UsernameMiniProfileBtn from "./UsernameMiniProfileBtn";
import type { errorT } from "../../utils/type/errorType";


type Props = {
  history:historyT[] | errorT;
  updatedProfile:boolean;
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
};

export function MiniHistory({history, updatedProfile, setUpdate}:Props) {
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
          {history.slice(0, nbSlice).map((game: historyT) => (
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
							<UsernameMiniProfileBtn id={player.id} name={player.username} updatedFriends={updatedProfile} setUpdate={setUpdate}/>
					</li>
                    ))}
                  </ul>
                </div>
              </td>
            </tr>
          ))}
          <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
            {history.length > 10? (isMore ? "Show less" : "Show more") : ""}
          </a>
        </table>
      </div>
    </div>
  );
}
