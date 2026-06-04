import { FaPlay } from "react-icons/fa";
import { createFakeGame } from "../../../utils/test_funcs/createFakeGameAvailable";
import UsernameMiniProfileBtn from "../../miniProfile/UsernameMiniProfileBtn";
import React, { useState, type SetStateAction } from "react";
import FilterGame from "./FilterGames";
import type { availableGameT } from "../../../utils/type/availableGameType";

export default function CreateOrJoin({logged_in, setIsInGame}: {logged_in: boolean, setIsInGame: React.Dispatch<SetStateAction<boolean>>}) {
  const availableGames = createFakeGame();
  const [filteredGames, setFilteredGames] = useState<availableGameT[]>([])

  setIsInGame(false)

  return (
    <div className=" mt-17 h-screen mr-15">
      <h1 className="">Create or join a game!</h1>
      <div className="w-full flex h-screen">
        <div className="createOrJoinBtn-container w-1/3 flex flex-col justify-center items-center h-8/12">
          <button className="btn m-3 ">Create</button>
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
                    <td>{game.host}'s room</td>
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
								  logged_in={logged_in}
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
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
    </div>
  );
}
