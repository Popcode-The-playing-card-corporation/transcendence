import { TbPointFilled } from "react-icons/tb";
import type { friendT } from "../utils/friendType";
import {
  acceptRequest,
  deleteRequest,
  denyRequest,
  friendArray,
  getFriends,
} from "../api/friend";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { refreshAuth } from "../api/checkAuth";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";

export function Friends() {
  const fakeRequest = [
    {
      id: 0,
      username: "crampus",
    },
    {
      id: 1,
      username: "babar",
    },
    {
      id: 2,
      username: "chepa",
    },
    {
      id: 3,
      username: "danaLaQueen",
    },
  ];

  const [friends, setFriends] = useState<friendT[] | errorT>({
    code: 0,
    response: "",
  });
  const navigate = useNavigate();
  const [updatedFriends, setUpdate] = useState(false);

  useEffect(() => {
    async function retrieveFriends() {
      let res = await getFriends();
      if ("code" in res) {
        if (res.code === 401) {
          if (!(await refreshAuth())) {
            navigate("/login");
          }
          res = await getFriends();
        }
        if ("code" in res) {
          setFriends(res);
        } else {
          const arr = friendArray(res);
          setFriends(arr);
        }
      } else {
        const arr = friendArray(res);
        setFriends(arr);
      }
    }
    retrieveFriends();
  }, [navigate, updatedFriends]);

  if ("code" in friends) {
    return <p>Error: {String(friends.response)}</p>; // improve message
  }

  //todo: add to button when it exists: onClick={() => changeHandler(friend.req_id, 'accept')}
  async function changeHandler(req_id: number, func: string) {
    if (func === "accept") {
      const res = await acceptRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    } else if (func === "deny") {
      const res = await denyRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    } else if (func === "delete") { // ??????????
      const res = await deleteRequest(req_id);
      if ("code" in res) {
        console.error(res.response);
      }
    }
    setUpdate(!updatedFriends);
    return;
  }

  return (
    <div className="friend-part min-h-70">
      <div className="btn-container my-5 flex justify-end gap-1">
        <button className="btn">
          <IoSearch />
        </button>
        <button className="btn">
          {" "}
          <FaPlus />{" "}
        </button>
        <div className="dropdown dropdown-end">
          <div className="indicator">
            <span className="indicator-item badge bg-(--nav-color)">{fakeRequest.length}</span>
            <div tabIndex={0} className="btn" role="button">
              <IoNotificationsOutline />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content bg-(--hover-color) rounded-box z-1 p-2 shadow-sm h-fit overflow-scroll"
            >
              {fakeRequest.map((request: { id: number; username: string }) => {
                return (
                  <li className="flex w-full my-3" key={request.id}>
                    <div className="flex gap-6 w-full">
                      <div className="username-request flex items-center w-2/3">
                        <p>{request.username}</p>
                      </div>
                      <div className="btn-accept-or-reject flex gap-3">
                        <button className="btn btn-circle" onClick={() => changeHandler(request.id, "accept")}>
                          <RxCheck />
                        </button>
                        <button className="btn btn-circle" onClick={() => changeHandler(request.id, "deny")}>
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
      <table>
        {/* <tr> */}
        {/*   <td className={(friends.is_online ? "text-green-400" : "") + " text-2xl text-center"}> */}
        {/*     <TbPointFilled /> */}
        {/*   </td> */}
        {/*   <td>{friend.user.username}</td> */}
        {/*   <td>{friend.status}</td> */}
        {/*   <td>{friend.status === 'pending' ? friend.created_at : friend.accepted_at}</td> */}
        {/* </tr> */}
        {friends.map((friend: friendT) => (
          <tr>
            <td
              className={
                (friend.user.is_online ? "text-green-400" : "") +
                " text-2xl text-center"
              }
            >
              <TbPointFilled />
            </td>
            <td>{friend.user.username}</td>
            <td>{friend.status}</td>
            <td>{friend.accepted_at}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
