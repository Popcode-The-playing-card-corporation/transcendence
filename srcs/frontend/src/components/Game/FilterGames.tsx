import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import type { availableGameT } from "../../utils/availableGameType";

export default function FilterGame({
  rawList,
  setFilteredGames,
}: {
  rawList: availableGameT[];
  setFilteredGames: React.Dispatch<React.SetStateAction<availableGameT[]>>;
}) {
  const [search, setSearch] = useState<string>("");
  const [dispFilter, setDispFilter] = useState<boolean>(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(2);

  const searchedGames = rawList.filter((game: availableGameT) => {
    if (!search) return true;
    const lower = search.toLocaleLowerCase();
    return game.host.toLocaleLowerCase().includes(lower);
  });

  const filteredGames = searchedGames.filter((game: availableGameT) => {
    return game.max_player >= maxPlayers;
  });

  useEffect(() => {
    const searchedGames = rawList.filter((game: availableGameT) => {
      if (!search) return true;
      const lower = search.toLocaleLowerCase();
      return game.host.toLocaleLowerCase().includes(lower);
    });

    const filteredGames = searchedGames.filter((game: availableGameT) => {
      return game.max_player >= maxPlayers + 2;
    });
    setFilteredGames(filteredGames);
  }, [filteredGames, setFilteredGames, maxPlayers, rawList, search]);

  return (
    <div className="filterGame flex justify-between my-2 items-center sticky -top-10 bg-(--bg-color) z-10 p-3 rounded-4xl shadow-2xl -mt-12">
      <label className="input w-1/3">
        <IoSearch className="text-2xl " />
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilteredGames(searchedGames);
          }}
        />
      </label>
      <form className="flex gap-3 justify-end items-center">
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
              min={0}
              max="50"
              defaultValue="0"
              // value={maxPlayers}
              onChange={(e) => setMaxPlayers(+e.target.value / 10)}
              className={
                "range [--range-progress:var(--hover-color)] [--range-thumb:var(--font-color)] [--range-thumb-size:20px] glass transition-all duration-500 "
              }
              step="10"
            />
          </label>
          {/* <div className="flex justify-between px-2.5 mt-2 text-xs"> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/*   <span>|</span> */}
          {/* </div> */}
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
          </div>
        </div>

        <input
          className={
            dispFilter
              ? "btn checked:bg-(--nav-color) opacity-100 transition-all duration-500"
              : "btn opacity-0" + " transition-all duration-500 translate-x-9"
          }
          type="checkbox"
          name="filter"
          aria-label="friends"
        />
        <input
          className={
            dispFilter
              ? "btn checked:bg-(--nav-color) transition-all duration-500"
              : " btn opacity-0" + " transition-all duration-500 translate-x-5"
          }
          type="checkbox"
          name="filter"
          aria-label="public"
        />
        <label className="btn btn-circle swap swap-rotate glass">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onClick={() => setDispFilter(!dispFilter)} />

          <FaFilter className="swap-off fill-current mx-auto" />
          <MdClose className="swap-on fill-current text-xl" />
        </label>
      </form>
    </div>
  );
}
