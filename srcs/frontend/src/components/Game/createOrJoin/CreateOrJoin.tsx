import { FaPlay } from "react-icons/fa";
// import { createFakeGame } from "../../../utils/test_funcs/createFakeGameAvailable";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import React, { useState, type SetStateAction } from "react";
import FilterGame from "./FilterGames";
import type { availableGameT } from "../../../utils/type/availableGameType";
import { createRoom, validateRoom } from "../../../api/http/game";
import { useNotif } from "../../hooks/useNotif";
// import { createFakeGame } from "../../../utils/test_funcs/createFakeGameAvailable.tsx";

type Props = {
	availableGames:availableGameT[],
	setJoined:React.Dispatch<SetStateAction<string>>,
}

export default function CreateOrJoin({availableGames, setJoined}: Props) {
  const [filteredGames, setFilteredGames] = useState<availableGameT[]>([])
  const notif = useNotif();
  const [code, setCode] = useState("");

const codeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  async function createGame() {
	const room = await createRoom();
	if ("code" in room) {
		notif?.showNotif("Game Creation Error", "There was an error creating the lobby. Please try again or refresh.", 5000);
		return ;
	}
	setJoined(room.room);
	notif?.showNotif("Room Created:", room.room, 5000)
	return ;
  }

  async function joinRoom(code: string) {
	const res = await validateRoom(code);
	if (res.code !== 200) {
		notif?.showNotif("Error Joining Room", res.response, 5000);
		return ;
	}
	setJoined(code);
  }

  return (
    <div className=" mt-17 h-screen mr-15">
      <h1 className="">Create or join a game!</h1>
      <div className="w-full flex h-screen">
        <div className="createOrJoinBtn-container w-1/3 flex flex-col justify-center items-center h-8/12">
          <button className="btn m-3 " onClick={createGame}>Create</button>
          <p>or</p>
          <div className="joinCode-container m-3">
            <input
              className="input w-2/3 m-3"
              type="text"
              placeholder="enter game code here"
			  value={code}
              onChange={codeChange}
            />
            <button className="btn" onClick={() => joinRoom(code)}>Join</button>
          </div>
        </div>
        <div className="listAvailableGame w-2/3 flex justify-center bordered overflow-scroll max-h-8/12">
		<div className="w-full">
		<FilterGame rawList={availableGames} setFilteredGames={setFilteredGames}/>
          <table className="table ml-10 ">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => {
                return (
                  <tr>
                    <td>{game.host.username}'s room</td>
                    <td>{game.type}</td>
                    <td>
                      <div className="dropdown">
                        <div
                          tabIndex={0}
                          role="button"
                          className="link hover:scale-110 hover:text-(--hover-color) transition-all"
                        >
                          {game.nb_player}/{game.max_player}
                        </div>
                        <ul
                          tabIndex={-1}
                          className="dropdown-content menu bg-(--hover-color) rounded-box z-1 w-52 p-2 shadow-sm"
                        >
                          {game.list_player.map((player) => (
                            <li>
                              <a className="text-(--font-color)">
                                <UsernameMiniProfileBtn
                                  id={player.id}
                                  name={player.username}
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td>
                      <button className="btn" onClick={() => joinRoom(game.code)}>
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
    </div>
  );
}
