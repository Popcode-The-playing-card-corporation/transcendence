import { TbPointFilled } from "react-icons/tb";
import type { friendT } from "../utils/friendType";
import { generateFakeFriends } from "../utils/generateArrayTestFriends";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";

export function Friends() {
  const friends = generateFakeFriends();

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
  return (
    <div className="friend-part">
      <div className="btn-container mb-5 flex justify-end gap-1">
        <button className="btn">
          <IoSearch />
        </button>
        <button className="btn">
          {" "}
          <FaPlus />{" "}
        </button>
        <div className="dropdown dropdown-end">
          <div className="indicator">
            <span className="indicator-item badge bg-(--nav-color)">69</span>
            <div tabIndex={0} className="btn" role="button">
              <IoNotificationsOutline />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content bg-(--hover-color) rounded-box z-1 p-2 shadow-sm"
            >
              {fakeRequest.map((request: { id: number; username: string }) => {
                return (
                  <li className="flex w-full my-3" key={request.id}>
                    <div className="flex gap-6 w-full">
                      <div className="username-request flex items-center w-2/3 overflow-hidden">
                        <p>{request.username}</p>
                      </div>
                      <div className="btn-accept-or-reject flex gap-3">
                        <button className="btn ">
                          <RxCheck />
                        </button>
                        <button className="btn">
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
        <tr>
          <th className="w-10 text-left"></th>
          <th className="w-50 text-left">Name</th>
          <th className="w-30 text-left">Status</th>
          <th className="w-30 text-left">From</th>
        </tr>
        {friends.map((friend: friendT) => (
          <tr>
            <td
              className={
                (friend.online ? "text-green-400" : "") +
                " text-2xl text-center"
              }
            >
              <TbPointFilled />
            </td>
            <td>{friend.username}</td>
            <td>{friend.status}</td>
            <td>{friend.date}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
