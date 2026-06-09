import { MdClose } from "react-icons/md";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import { type playerT } from "../../../utils/type/playerType";
import { useAuth } from "../../hooks/useAuth";

type Props = {
	kickPlayer:(playerId:number) => void;
	roomCode: string;
	listPlayer: playerT[];
}

export default function PlayerList({kickPlayer, listPlayer}:Props) {

	const auth = useAuth();
	const host_user = listPlayer.filter(user => user.is_host)[0]
	let id = 0;
	if (host_user) {
		id = host_user.id;
	}

  return (
    <div className="bordered h-">
      <table className="table">
        <thead className="text-xl w-full">
          <th></th>
          <th>List of players</th>
        </thead>
        <tbody >
          {listPlayer.map((player:playerT) => {
            return (
              <tr className="h-10 text-lg">
                <td className="w-1/12">
                  {listPlayer.indexOf(player) + 1}
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
