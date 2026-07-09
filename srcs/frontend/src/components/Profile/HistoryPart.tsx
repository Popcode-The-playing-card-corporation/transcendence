import { useState } from "react";
import type { historyT } from "../../utils/type/historyType";
import type { playerT } from "../../utils/type/playerType";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";

type Props = {
  gameHistory: historyT[];
  updatedProfile: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  isHome: boolean
};

export function History({ gameHistory, updatedProfile, setUpdate, isHome }: Props) {
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(isHome ? 3 : 10)
  // const fakeHistory =
  //   [
  //     {
  //       game_id: 0,
  //       start: "dnflds",
  //       points: 4,
  //       rank: 3,
  //       won: true,
  //       duration: 122,
  //       nb_player: 2,
  //       players: [
  //         {
  //           id: 0,
  //           username: "philipeadghjadhjasdhjgajhdgaddhgahgshjadgjh",
  //           is_host: true,
  //           position: 1,
  //         },
  //         {
  //           id: 1,
  //           username: "philip2",
  //           is_host: false,
  //           position: 1,
  //         },
  //       ]
  //     },

  //     {
  //       game_id: 1,
  //       start: "dnflds",
  //       points: 4,
  //       rank: 3,
  //       won: false,
  //       duration: 122,
  //       nb_player: 2,
  //       players: [
  //         {
  //           id: 0,
  //           username: "philipe",
  //           is_host: true,
  //           position: 1,
  //         },
  //         {
  //           id: 1,
  //           username: "philip2",
  //           is_host: false,
  //           position: 1,
  //         },
  //         {
  //           id: 2,
  //           username: "philip3",
  //           is_host: false,
  //           position: 2,
  //         },
  //       ]
  //     }
  //   ]


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
    <>
      {gameHistory.length === 0 ?
        <div className="text-center">
          <p>Once you have played a game, you'll be able to see it here !</p>
        </div>
        :
        <>
          <table className={"mt-5 table-auto text-center w-full" + (isHome ? " max-md:hidden" : "")} >
            <thead>
              <tr className="h-14">
                <th className="th-history">Game ID</th>
                <th className="w-40">Date</th>
                <th className="th-history">Your points</th>
                <th className="th-history">Time played</th>
                <th className="th-history">Nb players</th>
                <th className=" overflow-hidden">Opponents</th>
                <th className="th-history">Your result</th>
              </tr>
            </thead>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
              <tbody>
                <tr className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-y "}>
                  <td>
                    <p className="ml-2">{game.game_id} </p>
                  </td>
                  <td>{game.start}</td>
                  <td>{game.points}</td>
                  <td>{game.duration}</td>
                  <td>{game.nb_player}</td>
                  <td>
                    <div className="dropdown dropdown-center">
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
                              <li>
                                <UsernameMiniProfileBtn id={player.id} name={player.username} updatedFriends={updatedProfile} setUpdate={setUpdate} />
                              </li>
                            ))
                          )
                        }
                      </ul>
                    </div>
                  </td>
                  <td className={
                    (game.won ? "bg-success" : "bg-warning") +
                    " h-16 border-y border-base-200"}>{game.won ? "winner" : "loooser"}</td>
                </tr>
              </tbody>
            ))
            }
            {isHome ? null : (
              <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
                {gameHistory.length > 10 ? (isMore ? "Show less" : "Show more") : ""}

              </a>
            )}
          </table >
          <table className={"mt-5 table-auto text-center w-full" + (isHome ? "" : " hidden")} >
              <>
                <tr className="h-14">
                  <th className="th-history">Game ID</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}><p className="ml-2">{game.game_id} </p></td>
			))}
                </tr>
                <tr className="h-14">
                  <th className="w-40">Date</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}>{game.start}</td>
			))}
                </tr>
                <tr className="h-14">
                  <th className="th-history">Your points</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}>{game.points}</td>
			))}
                </tr>
                <tr className="h-14">
                  <th className="th-history">Time played</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}>{game.duration}</td>
			))}
                </tr>
                <tr className="h-14">
                  <th className="th-history">Nb players</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}>{game.nb_player}</td>
			))}
                </tr>
                <tr className="h-14">
                  <th className="overflow-hidden">Opponents</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={(isHome ? "bg-base-100 border-base-200" : "bg-base-200 border-base-100") + " border-x-4 "}>
                    <div className="dropdown dropdown-center">
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
                              <li>
                                <UsernameMiniProfileBtn id={player.id} name={player.username} updatedFriends={updatedProfile} setUpdate={setUpdate} />
                              </li>
                            ))
                          )
                        }
                      </ul>
                    </div>
                  </td>
			))}
                </tr>
                <tr>
                  <th className="th-history">Your result</th>
            {gameHistory.slice(0, nbSlice).map((game: historyT) => (
                  <td className={
                    (game.won ? "bg-success" : "bg-warning") +
                    " h-16 border-x-4 border-base-200"}>{game.won ? "winner" : "loooser"}</td>
			))}
                </tr>
              </>
          </table >
        </>
      }
    </>
  );
}
