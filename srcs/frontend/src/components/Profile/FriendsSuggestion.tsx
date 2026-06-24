import type { RefObject } from "react";
import { changeHandler } from "../../api/http/friend";
import type { recommendationT } from "../../utils/type/recommendationType";
import { FaPlus } from "react-icons/fa";
import type { NotifContextType } from "../contexts/NotifContext";

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
    <div className=" border-l ml-6 pl-6 border-(--bg-color) mx-auto">
      <h4 className="text font-bold text-center mb-4">Friends suggestion</h4>
      <table className="mx-auto w-full">
	  <tbody>
        {suggestions.map((suggest) => {
          return (
            <tr className="h-12 text-center">
              <td>{suggest.username}
			  <br/><span className="text-xs">{suggest.mutual_friends.length} mutual friends</span></td>
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
                  {" "}
                  <FaPlus />{" "}
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
