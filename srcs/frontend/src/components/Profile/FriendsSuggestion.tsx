import type { RefObject } from "react";
import { changeHandler } from "../../api/http/friend";
import type { recommendationT } from "../../utils/type/recommendationType";
import { FaPlus } from "react-icons/fa";
import type { NotifContextType } from "../contexts/NotifContext";
import UsernameMiniProfileBtn from "../miniProfile/UsernameMiniProfileBtn";

type Props = {
  suggestions: recommendationT[];
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  ref: RefObject<HTMLDialogElement | null>;
  notif: NotifContextType | undefined;
};

export default function FriendsSuggestion({
  suggestions,
  updatedFriends,
  setUpdate,
  ref,
  notif,
}: Props) {
  return (
    <div className=" border-l ml-6 pl-6 border-primary mx-auto max-md:hidden">
      <h4 className="text-lg font-bold text-center mb-4">Friends suggestion</h4>
      <table className="mx-auto w-full">
        <tbody>
          {suggestions.slice(0, 5).map((suggest) => {
            return (
              <tr className="h-12 text-center" key={suggest.id}>
                <td>
                  {" "}
                  <UsernameMiniProfileBtn
                    id={suggest.id}
                    name={suggest.username}
                  />
                  <br />
                  <span className="text-xs">
                    <button
                      className="link-hover"
                      popoverTarget="popover-1"
                      style={{ anchorName: "--anchor-1" }}
                    >
                      {suggest.mutual_friends.length} mutual friends
                    </button>
                    <ul
                      className="dropdown dropdown-content dropdown-center menu w-52 rounded-box shadow-sm"
                      popover="auto"
                      id="popover-1"
                      style={{ positionAnchor: "--anchor-1" }}
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
  );
}
