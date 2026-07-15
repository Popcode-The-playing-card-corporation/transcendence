import { useState } from "react";
import type { historyT } from "../../utils/type/historyType";
import type { playerT } from "../../utils/type/playerType";

type Props = {
  gameHistory: historyT[];
  isHome: boolean,
  isMiniProfile: boolean
};

export function History({ gameHistory, isHome, isMiniProfile }: Props) {
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(isHome ? 3 : 10)

  function handleMoreLessBtn() {
    if (isMore) {
      setIsMore(false);
      setNbSlice(isHome ? 3 : 10);
    }
    else {
      setIsMore(true);
      setNbSlice(gameHistory.length)
    }
  }
  return (
    <div className="">
      {gameHistory.length === 0 ?
        <div className="text-center">
          <p>Once you have played a game, you'll be able to see it here !</p>
        </div>
        :
        <>
          <table className={"mt-5 mb-32 table-auto text-center w-full" + (isHome ? " max-md:hidden " : (isMiniProfile ? " max-lg:hidden" : " max-md:hidden"))} >
            <thead className="text-base-content">
              <tr className="h-14">
                <th className="th-history"></th>
                <th className="w-40 ">Date</th>
                <th className="th-history">Your points</th>
                <th className="th-history">Time played</th>
                <th className="th-history">Nb players</th>
                <th className=" overflow-hidden">Opponents</th>
                <th className="th-history">Your result</th>
              </tr>
            </thead>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
              <tbody key={game.game_id}>
                <tr className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-y"}>
                  <td className={"px-2" + (isHome ? " bg-base-200" : " bg-base-100")}>
                    <p className="ml-2">{gameHistory.indexOf(game)}</p>
                  </td>
                  <td className="px-2">{game.start}</td>
                  <td className="px-2">{game.points}</td>
                  <td className="px-2">{game.duration}</td>
                  <td className="px-2">{game.nb_player}</td>
                  <td className="px-2">
                    <div className={"dropdown dropdown-center " + (gameHistory.indexOf(game) === gameHistory.length - 1 ? " dropdown-top" : "")}>
                      <div
                        tabIndex={0}
                        role="button"
                        className="link hover:scale-110 transition-all"
                      >
                        Click to see
                      </div>
                      <ul
                        tabIndex={-1}
                        className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm"
                      >
                        {game.players.length === 0 ?
                          <p>
                            No opponents.
                          </p>
                          :
                          (
                            game.players.map((player: playerT) => (
                              <li className="w-38 max-w-38" key={player.id}>
                                <p className="truncate">
                                  {player.username}
                                </p>
                              </li>
                            ))
                          )
                        }
                      </ul>
                    </div>
                  </td>
                  <td className={
                    (game.won ? "bg-success" : "bg-warning") +
                    " h-16 border-y px-2" + (isHome ? " border-base-200" : " border-base-100")}>{game.won ? "winner" : "loooser"}</td>
                </tr>
              </tbody>
            ))
            }
            {isHome || isMiniProfile ? null : (
              <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
                {gameHistory.length > 10 ? (isMore ? "Show less" : "Show more") : ""}

              </a>
            )}
          </table >
          <div className={"overflow-x-auto" + (isHome ? " md:hidden" : (isMiniProfile ? " lg:hidden" : " md:hidden"))}>
            <table className="table mt-5 text-center table-md table-pin-rows table-pin-cols">
              <thead>
                <tr className={"h-14 border-y-hidden" + (isHome ? " bg-base-200" : " bg-base-100")}>
                  <th className={(isHome ? "bg-base-200" : "bg-base-100") + " border-hidden"}></th>
                  <td className="w-40 border-hidden text-base-content">Date</td>
                  <td className="th-history border-hidden text-base-content">Your points</td>
                  <td className="th-history border-hidden text-base-content">Nb players</td>
                  <th className={(isHome ? "bg-base-200" : "bg-base-100") + " th-history border-hidden"}></th>
                </tr>
              </thead>
              {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                <tbody key={game.game_id}>
                  <tr className={isHome ? "bg-base-100" : "bg-base-200"}>
                    <th className={(isHome ? "bg-base-200" : "bg-base-100") + " px-2"}>
                      <p>{gameHistory.indexOf(game)}</p>
                    </th>
                    <td className={"px-2 border-y" + (isHome ? " border-base-200" : " border-base-100")}>{game.start}</td>
                    <td className={"px-2 border-y" + (isHome ? " border-base-200" : " border-base-100")}>{game.points}</td>
                    <td className={"px-2 border-y" + (isHome ? " border-base-200" : " border-base-100")}>{game.nb_player}</td>
                    <th className={
                      (game.won ? "bg-success" : "bg-warning") +
                      " h-16 border-y" + (isHome ? " border-base-200" : " border-base-100")}>{game.won ? "W" : "L"}</th>
                  </tr>
                </tbody>
              ))
              }
            </table >
          </div>
        </>
      }
    </div>
  );
}
