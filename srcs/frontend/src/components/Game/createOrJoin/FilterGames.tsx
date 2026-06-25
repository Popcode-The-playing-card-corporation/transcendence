import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import type { availableGameT } from "../../../utils/type/availableGameType";
import { IoMdRefresh } from "react-icons/io";

export default function FilterGame({
  refreshLobby,
  rawList,
  setFilteredGames,
}: {
  refreshLobby:() => void;
  rawList: availableGameT[];
  setFilteredGames: React.Dispatch<React.SetStateAction<availableGameT[]>>;
}) {
  const [search, setSearch] = useState<string>("");
  const [dispFilter, setDispFilter] = useState<boolean>(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    const searchedGames = rawList.filter((game: availableGameT) => {
      if (!search) return true;
      const lower = search.toLocaleLowerCase();
      return game.host.username.toLocaleLowerCase().includes(lower);
    });

    const filteredMaxPlayerGames = searchedGames.filter(
      (game: availableGameT) => {
        return game.max_player >= maxPlayers;
      },
    );

    const finalFilteredGames = filteredMaxPlayerGames.filter(
      (game: availableGameT) => {
        if (typeFilter === "All" || !typeFilter) return true;
        return game.type === typeFilter;
      },
    );

    setFilteredGames(finalFilteredGames);
  }, [maxPlayers, search, typeFilter, rawList, setFilteredGames]);

  return (
    <div className="filterGame flex justify-between my-2 items-center sticky -top-10 bg-(--bg-color) z-10 p-3 rounded-4xl shadow-2xl -mt-12">
	<div className="gap-2 flex">
      <label className="input w-3/4">
        <IoSearch className="text-2xl " />
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </label>
	<button onClick={refreshLobby} className="btn btn-circle"> <IoMdRefresh className="text-xl"/> </button>
	</div>
      <div className="flex gap-1 justify-end items-center">
        <div
          className={
            "w-50 max-w-xs transition-all duration-500 text-center" +
            (dispFilter
              ? ""
              : " opacity-0 transition-all duration-500 translate-x-12")
          }
        >
          <label>
            max players
            <input
              type="range"
              min="2"
              max="7"
              defaultValue="2"
              // value={maxPlayers}
              onChange={(e) => setMaxPlayers(+e.target.value / 10)}
              className={
                "range text-base-200 glass transition-all duration-500 "
              }
              step="1"
            />
          </label>
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
          </div>
        </div>

        <form className="filter">
          <input
            className={
              dispFilter
                ? "btn opacity-100 transition-all duration-500"
                : "btn opacity-0" + " transition-all duration-500 translate-x-9 "
            }
            type="radio"
            name="filter"
            aria-label="friends"
            value="friend"
            onClick={() => setTypeFilter("friends_only")}
          />
          <input
            className={
              dispFilter
                ? "btn transition-all duration-500"
                : " btn opacity-0" +
                  " transition-all duration-500 translate-x-5"
            }
            type="radio"
            name="filter"
            aria-label="public"
            value="public"
            onClick={() => setTypeFilter("public")}
          />
          <input
            name="filter"
            type="reset"
            value="All"
            onClick={() => setTypeFilter("All")}
            className={
              dispFilter
                ? "btn transition-all duration-500"
                : " btn opacity-0" +
                  " transition-all duration-500 translate-x-5"
            }
          />
        </form>
        <label className="btn btn-circle swap swap-rotate glass bg-base-200">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onClick={() => setDispFilter(!dispFilter)} />

          <FaFilter className="swap-off fill-current mx-auto" />
          <MdClose className="swap-on fill-current text-xl" />
        </label>
      </div>
    </div>
  );
}
