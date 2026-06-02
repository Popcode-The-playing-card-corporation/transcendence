import { TbPointFilled } from "react-icons/tb";
import type { friendT, requestT } from "../../utils/type/friendType";
import { changeHandler } from "../../api/http/friend";
import { useState, useRef } from "react";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { AddFriends } from "./AddFriends";
import DeleteBtn from "../utils/DeleteBtn";
import BlockBtn from "../utils/BlockBtn";
import { FaPlus } from "react-icons/fa";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";
import { useNotif } from "../hooks/useNotif";
import type { recommendationT } from "../../utils/type/recommendationType";

type Props = {
  friends:friendT[];
  requests:requestT[];
  recs:recommendationT[];
  logged_in:boolean;
  updatedFriends:boolean;
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
};

export function Friends({friends, requests, recs, updatedFriends, logged_in, setUpdate}: Props) {
  const addFriendsRef = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState<string>("");
  const [isMore, setIsMore] = useState<boolean>(false);
  const [nbSlice, setNbSlice] = useState<number>(10);
  const notif = useNotif();

  function handleMoreLessBtn() {
    if (isMore) {
      setIsMore(false);
      setNbSlice(10);
    } else {
      setIsMore(true);
      setNbSlice(sortedFriends.length);
    }
  }

  const searchedFriends = friends.filter((friend) => {
    if (!search) return true;
    const lower = search.toLocaleLowerCase();
    return friend.user.username.toLocaleLowerCase().includes(lower);
  });

  const sortedFriends = [...searchedFriends].sort((a, b) =>
    a.status.localeCompare(b.status),
  );

  return (
    <div className="friend-part min-h-70">
      <div className="action-container flex justify-between">
        <label className="input my-5">
          <IoSearch className="text-2xl" />
          <input
            type="search"
            required
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="btn-container my-5 flex justify-end gap-1">
          <button
            className="btn"
            onClick={() => addFriendsRef.current?.showModal()}
          >
            {" "}
            <FaPlus />{" "}
          </button>
          <dialog id="add_new_friends" className="modal" ref={addFriendsRef}>
            <AddFriends recs={recs}/>
          </dialog>
          <div className="dropdown dropdown-end">
            <div className="indicator">
              <span
                className={
                  "indicator-item badge bg-(--nav-color)" +
                  (requests.length === 0 ? " hidden" : "")
                }
              >
                {requests.length}
              </span>
              <div tabIndex={0} className="btn" role="button">
                <IoNotificationsOutline />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className={
                "dropdown-content bg-(--hover-color) rounded-box z-1 p-2 shadow-sm h-fit overflow-scroll" +
                (requests.length === 0 ? " hidden" : "")
              }
            >
              {requests.map((request: { id: number; username: string }) => {
                return (
                  <li className="flex w-full my-3" key={request.id}>
                    <div className="flex gap-6 w-full">
                      <div className="username-request flex items-center w-2/3">
                        <p>{request.username}</p>
                      </div>
                      <div className="btn-accept-or-reject flex gap-3">
                        <button
                          className="btn btn-circle validate"
                          onClick={() => changeHandler(request.id, "accept", updatedFriends, setUpdate, null, notif)}
                        >
                          <RxCheck />
                        </button>
                        <button
                          className="btn btn-circle del"
                          onClick={() => changeHandler(request.id, "delete", updatedFriends, setUpdate, null, notif)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <table className="">
        <tr>
          <th className="w-10 text-left"></th>
          <th className="w-50 text-left">Name</th>
          <th className="w-30 text-left">Status</th>
          <th className="w-30 text-left">From</th>
        </tr>
        {sortedFriends.slice(0, nbSlice).map((friend: friendT) => (
          <tr className="h-14">
            <td
              className={
                (friend.user.is_online ? "text-green-400" : "") +
                " text-2xl text-center"
              }
            >
              <TbPointFilled />
            </td>
            <td>
              <UsernameMiniProfileBtn id={friend.user.id} name={friend.user.username} updatedFriends={updatedFriends} setUpdate={setUpdate} logged_in={logged_in}/>
            </td>
            <td>{friend.status}</td>
            <td>
              {friend.status === "pending"
                ? friend.created_at
                : friend.accepted_at}
            </td>
            <td className="w-16">
              <DeleteBtn req_id={friend.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={null}/>
            </td>
            <td>
              <BlockBtn req_id={friend.user.id} updatedFriends={updatedFriends} setUpdate={setUpdate} profileRef={null}/>
            </td>
          </tr>
        ))}
      </table>
      <a className="my-auto link" onClick={() => handleMoreLessBtn()}>
        {sortedFriends.length > 10 ? (isMore ? "Show less" : "Show more") : ""}
      </a>
    </div>
  );
}
