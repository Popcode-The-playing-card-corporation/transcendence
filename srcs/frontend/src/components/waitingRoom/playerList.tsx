import { useState } from "react";
import generateFakePlayerList from "../../utils/test_funcs/generateFakePlayerList";
import UsernameMiniProfileBtn from "../MiniProfile/UsernameMiniProfileBtn";

export default function PlayerList() {
  const fakePlayers = generateFakePlayerList();
  const [fakeBool, setFakeBool] = useState<boolean>(false);

  return (
    <div className="bordered">
      <table className="table-auto">
        <thead className="text-xl ">
          <tr>List of players</tr>
        </thead>
        <tbody>
            {fakePlayers.map((player) => (
              <tr>
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
