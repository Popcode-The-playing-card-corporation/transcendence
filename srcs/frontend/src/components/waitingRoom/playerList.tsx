import { useState } from "react";
import generateFakePlayerList from "../../utils/test_funcs/generateFakePlayerList";
import UsernameMiniProfileBtn from "../MiniProfile/UsernameMiniProfileBtn";

export default function PlayerList() {
  const fakePlayers = generateFakePlayerList();
  const [fakeBool, setFakeBool] = useState<boolean>(false);

  return (
    <div className="bordered">
      <table className="table">
        <thead className="text-xl w-full">
          <th></th>
          <th>List of players</th>
        </thead>
        <tbody >
            {fakePlayers.map((player) => (
              <tr className="h-10 text-lg">
                <td className="w-1/12">
                  {fakePlayers.indexOf(player) + 1}
                </td>
                <td >
                  <UsernameMiniProfileBtn id={player.id} name={player.username} updatedFriends={fakeBool} setUpdate={setFakeBool} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
