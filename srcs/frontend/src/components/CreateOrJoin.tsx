import { FaPlay } from "react-icons/fa";
import { createFakeGame } from "../utils/test_funcs/createFakeGameAvailable";

export default function CreateOrJoin() {
  const availableGames = createFakeGame();
  return (
    <div className="page-content mt-17">
      <h1 className="">Game</h1>
      <div className="w-full flex h-full">
        <div className="createOrJoinBtn-container w-1/3 flex flex-col my-auto items-center ">
          <button className="btn m-3">Create</button>
          <p>or</p>
          <div className="joinCode-container m-3">
            <input
              className="input w-2/3 m-3"
              type="text"
              placeholder="enter game code here"
            />
            <button className="btn">Join</button>
          </div>
        </div>
        <div className="listAvailableGame w-2/3 flex justify-center bordered h-fit max-h-8/12 m-6">
          <table className="table ml-10">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th> {/* Public or friend's game */}
                <th>nb of player/max player</th>
                <th>pending</th>
              </tr>
            </thead>
            <tbody>
              {availableGames.map((game) => {
                return (
                  <tr>
                    <td>{game.host}'s room</td>
                    <td></td>
                    <td></td>
                    <td>
                      <button className="btn">
                        <FaPlay />{" "}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
