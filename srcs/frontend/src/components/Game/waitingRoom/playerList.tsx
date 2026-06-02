import generateFakePlayerList from "../../../utils/test_funcs/generateFakePlayerList";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";

export default function PlayerList({logged_in} : {logged_in : boolean}) {
  const fakePlayers = generateFakePlayerList();

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
                  <UsernameMiniProfileBtn id={player.id} name={player.username} logged_in={logged_in}/>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
