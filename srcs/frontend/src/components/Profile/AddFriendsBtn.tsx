import { FaPlus } from "react-icons/fa";
import { changeHandler } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";

type Props = {
  req_id: number;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  profileRef: React.RefObject<HTMLDialogElement | null>
};

export default function AddFriendsBtn({req_id, updatedFriends, setUpdate, profileRef}: Props) {
	const notif = useNotif();
	return (
    <div>
      <button
        className="btn"
        onClick={() => changeHandler(req_id, "request", updatedFriends, setUpdate, profileRef, notif)}
      >
        {" "}
        <FaPlus />{" "}
        </button>

    </div>
  );

}