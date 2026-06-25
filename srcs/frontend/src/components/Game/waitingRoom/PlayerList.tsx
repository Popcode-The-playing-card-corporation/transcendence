import { MdClose } from "react-icons/md";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import { type playerT } from "../../../utils/type/playerType";
import { useAuth } from "../../hooks/useAuth";
import { useGame } from "../context/GameContext";

export default function PlayerList() {

	const auth = useAuth();
	const { kickPlayer, state } = useGame();
	const listPlayer = state.settings.listPlayer;

	if (!listPlayer) {
		return ;
	}
	const host_user = listPlayer.filter(user => user.is_host)[0]
	let id = 0;
	if (host_user) {
		id = host_user.id;
	}
	const orderedPlayers = host_user ? [host_user, ...listPlayer.filter(player => player.id !== host_user.id)] : listPlayer;

  return (
    <div className="bordered bg-base-100">
      <table className="table">
        <thead className="text-xl w-full">
          <th></th>
          <th>List of players</th>
        </thead>
        <tbody >
          {orderedPlayers.map((player:playerT) => {
            return (
              <tr className="h-10 text-lg">
                <td className="w-1/12">
                  {orderedPlayers.indexOf(player) + 1}
                </td>
                <td >
                  <UsernameMiniProfileBtn id={player.id} name={player.username}/>
                </td>
                <td>
                  {!player.is_host ? ( id === auth.userID ? 
                  <button className="btn"onClick={() => kickPlayer(player.position)}>
                    <MdClose />
                  </button> : null)
                  : (<p className="text-(--hover-color)">Host</p>)
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
