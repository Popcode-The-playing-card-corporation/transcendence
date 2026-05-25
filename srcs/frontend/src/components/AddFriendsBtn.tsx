import { FaPlus } from "react-icons/fa";
import { changeHandler } from "../api/friend";

type Props = {
  req_id: number;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddFriendsBtn({req_id, updatedFriends, setUpdate}: Props) {
	return (
    <div>
      <button
        className="btn"
        onClick={() => changeHandler(req_id, "accept", updatedFriends, setUpdate)}
      >
        {" "}
        <FaPlus />{" "}
        </button>

    </div>
  );

}