import generateFakePlayerList from "../../utils/test_funcs/generateFakePlayerList";
import UsernameMiniProfileBtn from "../MiniProfile/UsernameMiniProfileBtn";

export default function PlayerList() {
  const fakePlayers = generateFakePlayerList();

  return (
    <div className="bordered">
      <table className="table-auto">
        <thead className="text-xl">
          <tr>List of players</tr>
        </thead>
        <tbody>
          <tr>
            {fakePlayers.map((player) => (
              <UsernameMiniProfileBtn id={player.id} updatedFriends={} setUpdate={}/>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
