import { useState } from "react";
import type { historyT } from "../../utils/type/historyType";
import type { playerT } from "../../utils/type/playerType";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";

type Props = {
  gameHistory:historyT[];
  updatedProfile:boolean;
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
};

export function History({gameHistory, updatedProfile, setUpdate}: Props) {
  const [isMore, setIsMore] = useState(false);
  const [nbSlice, setNbSlice] = useState(10)
  // const fakeHistory = 
	  // [
		  // {
		  //  game_id: 0,
		  //  start: "dnflds",
		  //  points: 4,
		  //  rank: 3,
		  //  won: true,
		  //  duration: 122,
		  //  nb_player: 2,
		  // players: [
		  // 	{
		  // 		id: 0,
		  // 		username: "philipe",
		  // 		is_host: true,
		  // 		position: 1,
		  // 	},
		  // 	{
		  // 		id: 1,
		  // 		username: "philip2",
		  // 		is_host: false,
		  // 		position: 1,
		  // 	},
		  // ]
		  // },
		  //
		  // {
		  //  game_id: 1,
		  //  start: "dnflds",
		  //  points: 4,
		  //  rank: 3,
		  //  won: false,
		  //  duration: 122,
		  //  nb_player: 2,
		  // players: [
		  // 	{
		  // 		id: 0,
		  // 		username: "philipe",
		  // 		is_host: true,
		  // 		position: 1,
		  // 	},
		  // 	{
		  // 		id: 1,
		  // 		username: "philip2",
		  // 		is_host: false,
		  // 		position: 1,
		  // 	},
		  // 	{
		  // 		id: 2,
		  // 		username: "philip3",
		  // 		is_host: false,
		  // 		position: 2,
		  // 	},
		  // ]
		  // }
	  // ]
  

  function handleMoreLessBtn() {
	  if (isMore) {
		  setIsMore(false);
		  setNbSlice(10);
	  }
	  else {
		  setIsMore(true);
		  setNbSlice(gameHistory.length)
	  }
  }
  return (
    <table className="mt-5 table-auto text-center w-full">
      <tr className="h-14">
        <th className="th-history">Game ID</th>
        <th className="w-40">Date</th>
        <th className="th-history">Your points</th>
        <th className="th-history">Your result</th>
        <th className="th-history">Time played</th>
        <th className="th-history">Nb players</th>
        <th className=" overflow-hidden">Opponents</th>
      </tr>
      {gameHistory.slice(0, nbSlice).map((game: historyT) => (
        <tr
          className={
            (game.won ? "bg-success" : "bg-warning") +
            " h-16 border-b-2 border-base-100"
          }
        >
          <td>
            <p className="ml-2">{game.game_id} </p>
          </td>
          <td>{game.start}</td>
          <td>{game.points}</td>
          <td>{game.won ? "winner" : "loooser"}</td>
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
        {gameHistory.length > 10? (isMore ? "Show less" : "Show more") : ""}
        
      </a>
    </table>
  );
}
