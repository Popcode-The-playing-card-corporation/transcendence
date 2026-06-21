import { useRef } from "react";
// import { generateFakeDetailedGame } from "../../../../utils/test_funcs/generateFakeDetailedGame";
// import { generateFakeUsersInGame } from "../../../../utils/test_funcs/generateFakeUsersInGame";
import { useGame } from "../../context/GameContext";
import type { DetailedPointsT, playerScoreT } from "../../../../utils/type/boardDataType";

export default function DetailledLeaderboard() {
  const { state } = useGame();
  const listPlayer = state.game.boardData.points;
  const detailedGame = state.game.boardData.detailed_points;
  const scoreDetailsRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="link-hover mt-2 px-auto"
        onClick={() => scoreDetailsRef.current?.showModal()}
      >
        more details
      </button>
      <dialog id="score_details_modal" className="modal" ref={scoreDetailsRef}>
        <div className="modal-box bg-(--bg-color)">
          <h3 className="font-bold text-lg text-center mb-2">
            Game's leaderboard
          </h3>
          <table className="table text-center">
            <thead>
              <tr className="bg-(--nav-color) sticky -top-6 ">
                {listPlayer.map((player: playerScoreT) => {
                  return <th>{player.username}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {detailedGame.map((game: DetailedPointsT) => {
                return (
                  <>
                    {game.rounds.map((round: {players: playerScoreT[]}) => {
                      const isHidden = round.players.every(
                        (current) => current.score === 0,
                      );

                      if (!isHidden) {
                        return (
                          <tr>
                            {round.players.map((player: playerScoreT) => {
                              return (
                                <td>{player.score ? player.score : "-"}</td>
                              );
                            })}
                          </tr>
                        );
                      }
                    })}
                    {game.is_finished ? (
                      <tr className="bg-(--hover-color)">
                        {game.total.map((player: playerScoreT) => {
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
                {listPlayer.map((player: playerScoreT) => {
                  return <td>{player.score}</td>;
                })}
              </tr>
            </tbody>
          </table>
          <p className="py-4 text-center">
            Press ESC key or click outside to close
          </p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
