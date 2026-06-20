// import { generateFakeUsersInGame } from "../../../../utils/test_funcs/generateFakeUsersInGame";
import type { userInGameT } from "../../../../utils/type/userInGameType";
import { useAuth } from "../../../hooks/useAuth";
import UsernameMiniProfileBtn from "../../../miniProfile/UsernameMiniProfileBtn";
import { useGame } from "../../context/GameContext";

export default function LittleLeaderboard() {
  const { state } = useGame();
  const auth = useAuth();
  const listPlayer = state.game.boardData.points;

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
                  (auth.userID === player.id ? " bg-(--nav-color) font-bold " : "")
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
