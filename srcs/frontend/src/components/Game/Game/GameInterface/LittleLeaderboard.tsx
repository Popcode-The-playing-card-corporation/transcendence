import { generateFakeUsersInGame } from "../../../../utils/test_funcs/generateFakeUsersInGame";
import type { userInGameT } from "../../../../utils/type/userInGameType";
import UsernameMiniProfileBtn from "../../../miniProfile/UsernameMiniProfileBtn";

export default function LittleLeaderboard() {
  const listPlayer = generateFakeUsersInGame();
  const current = { id: 4, username: "alexouille", score: 69 };

  function compareFn(a: userInGameT, b: userInGameT) {
    if (a.score > b.score) return 1;
    else if (a.score < b.score) return -1;
    else return 0;
  }
  const sortedPlayer = listPlayer.slice().sort(compareFn);
	return (

      <table className="w-full mt-2">
        <thead className="w-full">
          <th>Position</th>
          <th className="w-1/3">Username</th>
          <th className="w-1/3">Score</th>
        </thead>
        <tbody className="bg-(--hover-color)">
          {sortedPlayer.map((player) => {
            return (
              <tr
                className={
                  "h-10 border-y border-(--bg-color)" +
                  (current.id === player.id ? " bg-(--nav-color) font-bold " : "")
                }
              >
                <td className="text-center">
                  {sortedPlayer.indexOf(player) + 1}
                </td>
                <td className="text-center">
                  <UsernameMiniProfileBtn
                    id={player.id}
                    name={player.username}
                  />
                </td>
                <td className="text-center">{player.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
	);
}
