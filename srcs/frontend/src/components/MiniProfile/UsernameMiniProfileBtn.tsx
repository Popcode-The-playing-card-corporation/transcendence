
import { useRef, useState } from "react";
import MiniProfile from "./MiniProfile";
import type { profileT } from "../../utils/profileType";
import type { errorT } from "../../utils/errorType";
import { getProfile } from "../../api/friend";
import { type historyT } from "../../utils/historyType";
import { getPlayerHistory, historyArray } from "../../api/history";

type Props = {
  id: number;
  name: string;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsernameMiniProfileBtn({id, name, updatedFriends, setUpdate}: Props) {
  const showMiniProfileRef = useRef<HTMLDialogElement>(null);
  	
  const [account, setAccount] = useState<profileT | errorT>({code:200, response:""})
  const [history, setHistory] = useState<historyT[] | errorT>({code:200, response:""});

	async function load_mini() {
		const tmp_account = await getProfile(id);
		if ('code' in tmp_account) {
			return ;
		}
		setAccount(tmp_account);
		const gameHistory = await getPlayerHistory(id);
		if ("code" in gameHistory) {
			setHistory(gameHistory);
		} else {
			setHistory(await historyArray(gameHistory));
		}
		showMiniProfileRef.current?.showModal()
		return ;
	}

	
	return (
    <>
    <button
      className="link-hover"
      onClick={load_mini}
    >
    {name}
    </button>
    <dialog
      id="showMiniProfile"
      className="modal"
      ref={showMiniProfileRef}
    >
      <MiniProfile account={account} updatedFriends={updatedFriends} setUpdate={setUpdate} history={history} profileRef={showMiniProfileRef}/>
    </dialog>
      </>
	);
}