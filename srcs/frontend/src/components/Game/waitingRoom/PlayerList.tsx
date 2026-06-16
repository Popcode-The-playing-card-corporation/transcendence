import { MdClose } from "react-icons/md";
import generateFakePlayerList from "../../../utils/test_funcs/generateFakePlayerList";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import { useState } from "react";
import { type playerT } from "../../../utils/type/playerType";

export default function PlayerList() {
  const [fakePlayers, setFakePlayers] = useState<playerT[]>(generateFakePlayerList())

  function removePlayer(playerId: number) {
    const newPlayers = fakePlayers.filter((p) => p.id !== playerId)
    console.log(playerId);
    setFakePlayers(newPlayers);
  }

  return (
    <div className="bordered h-">
      <table className="table">
        <thead className="text-xl w-full">
          <th></th>
          <th>List of players</th>
        </thead>
        <tbody >
          {fakePlayers.map((player) => {
            return (
              <tr className="h-10 text-lg">
                <td className="w-1/12">
                  {fakePlayers.indexOf(player) + 1}
                </td>
                <td >
                  <UsernameMiniProfileBtn id={player.id} name={player.username}/>
                </td>
                <td>
                  {player.id !== 0 ? (
                  <button className="btn"onClick={() => removePlayer(player.id)}>
                    <MdClose />
                  </button>)
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
