
import { useRef } from "react";
import MiniProfile from "./MiniProfile";
import { generateFakeAccount } from "../../utils/test_funcs/generateTestAccount";

type Props = {
  id: number;
  // showMiniProfileRef: Ref<HTMLDialogElement>;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsernameMiniProfileBtn({id, updatedFriends, setUpdate}: Props) {
  const fakeAccount = generateFakeAccount();
  const showMiniProfileRef = useRef<HTMLDialogElement>(null);

	return (
    <>
    <button
      className="link-hover"
      onClick={() => showMiniProfileRef.current?.showModal()}
    >
    {fakeAccount.username}
    </button>
    <dialog
      id="showMiniProfile"
      className="modal"
      ref={showMiniProfileRef}
    >
      <MiniProfile id={id} updatedFriends={updatedFriends} setUpdate={setUpdate}/>
    </dialog>
      </>
	);
}