import { useRef } from "react";
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
      <dialog id="score_details_modal" className="modal" onKeyDown={(e) => e.stopPropagation()} ref={scoreDetailsRef}>
        <div className="modal-box max-w-fit">
          <h3 className="font-bold text-lg text-center mb-2">
            Game's leaderboard
          </h3>
          <table className="table text-center bg-base-200">
            <thead>
              <tr className=" sticky -top-6 ">
                {listPlayer.map((player: playerScoreT) => {
                  return <th key={player.user_id}>{player.username}</th>;
                })}
              </tr>
            </thead>
            <tbody className="bg-base-200">
              {detailedGame.map((game: DetailedPointsT) => {
                return (
                  <div key={detailedGame.indexOf(game)}>
                    {game.rounds.map((round: {players: playerScoreT[]}) => {
                      const isHidden = round.players.every(
                        (current) => current.score === 0,
                      );

                      if (!isHidden) {
                        return (
                          <tr key={game.rounds.indexOf(round)}>
                            {round.players.map((player: playerScoreT) => {
                              return (
                                <td key={player.user_id}>{player.score ? player.score : "-"}</td>
                              );
                            })}
                          </tr>
                        );
                      }
                    })}
                    {game.is_finished ? (
                      <tr className="bg-secondary">
                        {game.total.map((player: playerScoreT) => {
                          return <td key={player.user_id}>{player.score}</td>;
                        })}
                      </tr>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
              <tr className="bg-primary font-bold sticky -bottom-6">
                {listPlayer.map((player: playerScoreT) => {
                  return <td key={player.user_id}>{player.score}</td>;
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
