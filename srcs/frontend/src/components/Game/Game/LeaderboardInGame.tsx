import { useRef } from "react";
import { generateFakeUsersInGame } from "../../../utils/test_funcs/generateFakeUsersInGame";
import type { userInGameT } from "../../../utils/type/userInGameType";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import { generateFakeDetailedGame } from "../../../utils/test_funcs/generateFakeDetailedGame";
import type {
  detailedGameT,
  detailedRoundT,
} from "../../../utils/type/detailedGame";
import Time from "./Time";

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
  const sortedPlayer = listPlayer.slice().sort(compareFn);


  return (
    <div className="h-1/2 p-2 flex flex-col items-center">
	<Time />
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
          <h3 className="font-bold text-lg text-center mb-2">Game's leaderboard</h3>
          <table className="table text-center">
            <thead>
              <tr className="bg-(--nav-color) sticky -top-6 ">
                {listPlayer.map((player: userInGameT) => {
                  return <th>{player.username}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {detailedGame.map((game: detailedGameT) => {
                return (
                  <>
                    {game.rounds.map((round: detailedRoundT) => {
						const isHidden= round.players.every((current) => current.score === 0) 

						if (!isHidden) {

						return (
                        <tr>
                          {round.players.map((player: userInGameT) => {
                            return <td>{player.score ? player.score : "-"}</td>;
                          })}
                        </tr>
                      );
						}
                    })}
                    {game.is_finished ? (
                      <tr className="bg-(--hover-color)">
                        {game.total.map((player: userInGameT) => {
                          return <td>{player.score}</td>;
                        })}
                      </tr>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })}
              <tr className="bg-(--nav-color) font-bold sticky -bottom-6">
                {listPlayer.map((player: userInGameT) => {
                  return <td>{player.score}</td>;
                })}
              </tr>
            </tbody>
          </table>
          <p className="py-4 text-center">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
