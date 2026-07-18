import { useState, type RefObject } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import type { recommendationT } from "../../utils/type/recommendationType";
import type { requestT } from "../../utils/type/friendType";
import { changeHandler } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";
import FriendsSuggestion from "./FriendsSuggestion";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";

type Props = {
  users: requestT[];
  recs: recommendationT[];
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  ref: RefObject<HTMLDialogElement | null>;
};

export function AddFriends({
  recs,
  users,
  updatedFriends,
  setUpdate,
  ref,
}: Props) {
  const notif = useNotif();
  const [search, setSearch] = useState("");

  const searchedUsers = users.filter((user) => {
    if (search.length === 0) return true;
    else return user.username.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <>
      <div className="modal-box bg-(--nav-color) md:w-fit md:flex">
        <form method="dialog" className="md:hidden">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-3xl">
            ✕
          </button>
        </form>
        <div>
          <div>
            <h3 className="font-bold text-lg text-center">Add new friends</h3>
            <p className="py-4 text-center max-md:hidden">
              Press ESC key to close
            </p>
          </div>
          <div className="items-center flex flex-col">
            <label className="input my-5">
              <IoSearch className="text-2xl" />
              <input
                id="searchAddFriends"
                type="search"
                required
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div
              className={
                "mini-suggest mt-2 md:hidden" +
                (search.length > 0 ? " hidden" : "")
              }
            >
              <h3>Friend suggestion</h3>
              <table className={"mx-auto w-full"}>
                <tbody>
                  {recs.slice(0, 3).map((suggest) => {
                    return (
                      <tr
                        className="h-12 text-center"
                        key={recs.indexOf(suggest)}
                      >
                        <td>
                          {" "}
                          <UsernameMiniProfileBtn
                            id={suggest.id}
                            name={suggest.username}
                          />
                          <br />
                          <span className="text-xs">
                            <button
                              className="link-hover "
                              popoverTarget={`popover-${recs.indexOf(suggest)}`}
                              style={{
                                anchorName: `--anchor-${recs.indexOf(suggest)}`,
                              }}
                            >
                              {suggest.mutual_friends.length} mutual friends
                            </button>
                            <ul
                              className="dropdown dropdown-content dropdown-center menu w-52 rounded-box shadow-sm"
                              popover="auto"
                              id={`popover-${recs.indexOf(suggest)}`}
                              style={{
                                positionAnchor: `--anchor-${recs.indexOf(suggest)}`,
                              }}
                            >
                              {suggest.mutual_friends.map((player) => (
                                <li key={player.id}>{player.username}</li>
                              ))}
                            </ul>
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-circle"
                            onClick={() =>
                              changeHandler(
                                suggest.id,
                                "request",
                                updatedFriends,
                                setUpdate,
                                ref,
                                notif,
                              )
                            }
                          >
                            <FaPlus />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className={
                "result flex" + (search.length > 0 ? "" : " max-md:hidden")
              }
            >
              {
                <table className=" mx-auto">
                  <tbody>
                    <tr>
                      <th className="w-28"></th>
                      <th></th>
                    </tr>
                    {searchedUsers.slice(0, 10).map((res) => {
                      return (
                        <tr className="h-14" key={res.id}>
                          <td>
                            <UsernameMiniProfileBtn
                              id={res.id}
                              name={res.username}
                            />{" "}
                          </td>
                          <td>
                            <button
                              className="btn btn-circle"
                              onClick={() =>
                                changeHandler(
                                  res.id,
                                  "request",
                                  updatedFriends,
                                  setUpdate,
                                  ref,
                                  notif,
                                )
                              }
                            >
                              {" "}
                              <FaPlus />{" "}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
        <FriendsSuggestion
          suggestions={recs}
          ref={ref}
          notif={notif}
          updatedFriends={updatedFriends}
          setUpdate={setUpdate}
        />
      </div>
      <form method="dialog" className="modal-backdrop max-md:hidden">
        <button></button>
      </form>
    </>
  );
}
