import { useRef } from "react";
import { generateFakeUsersInGame } from "../../../utils/test_funcs/generateFakeUsersInGame";
import type { userInGameT } from "../../../utils/type/userInGameType";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import { generateFakeDetailedGame } from "../../../utils/test_funcs/generateFakeDetailedGame";
import type { detailedGameT, detailedRoundT } from "../../../utils/type/detailedGame";

export default function LeadderboardInGame() {
  const listPlayer = generateFakeUsersInGame();
  const detailedGame = generateFakeDetailedGame();
  const current = { id: 4, username: "alexouille", score: 69 };
  const scoreDetailsRef = useRef<HTMLDialogElement>(null);
  function compareFn(a: userInGameT, b: userInGameT) {
    if (a.score > b.score) return 1;
    else if (a.score < b.score) return -1;
    else return 0;
  }
  const sortedPlayer = listPlayer.sort(compareFn);

  return (
    <div className="h-1/2 p-2 flex flex-col items-center">
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
                  (current.id === player.id ? " bg-(--nav-color) " : "")
                }
              >
                <td className="text-center">
                  {listPlayer.indexOf(player) + 1}
                </td>
                <td className="text-center">
                  <UsernameMiniProfileBtn
                    id={player.id}
                    name={player.username}
                    logged_in={true}
                  />
                </td>
                <td className="text-center">{player.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="link-hover mt-2 px-auto"
        onClick={() => scoreDetailsRef.current?.showModal()}
      >
        more details
      </button>
      <dialog id="score_details_modal" className="modal" ref={scoreDetailsRef}>
        <div className="modal-box bg-(--bg-color)">
          <h3 className="font-bold text-lg">Game's leaderboard</h3>
          <table className="table">
            <thead>
              <tr>
                {listPlayer.map((player: userInGameT) => {
                  return <th>{player.username}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {detailedGame.map((game: detailedGameT) => {
                return (
                  <div>
                    {game.rounds.map((round: detailedRoundT) => {
                      return (
                        <tr>
						{round.players.map((player : userInGameT) => {
							return (
								<td>{player.username}</td>
							)
						})}
                        </tr>
                      );
                    })}
                  </div>
                );
              })}
            </tbody>
          </table>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
