import type { playerScoreT } from "../../../../utils/type/boardDataType";
import UsernameMiniProfileBtn from "../../../miniProfile/UsernameMiniProfileBtn";
import { useGame } from "../../context/GameContext";

export default function LittleLeaderboard() {
  const { state } = useGame();
  const listPlayer = state.game.boardData.points;

  function compareFn(a: playerScoreT, b: playerScoreT) {
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
        <tbody className="bg-base-100">
          {sortedPlayer.map((player) => {

            return (
              <tr
			  key={player.user_id}
                className={
                  "h-10 border-y border-base-200" +
                  (state.game.boardData.self_id === player.room_id ? " bg-primary font-bold " : "")
                }
              >
                <td className="text-center">
                  {sortedPlayer.indexOf(player) + 1}
                </td>
                <td className="text-center">
                  <UsernameMiniProfileBtn
                    id={player.user_id}
                    name={player.username.length > 10 ? (player.username.substring(0, 10) + "...") : player.username}
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
