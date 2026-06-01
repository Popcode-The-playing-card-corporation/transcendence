
import { useRef, useState } from "react";
import MiniProfile from "./MiniProfile";
import type { profileT } from "../../utils/profileType";
import type { errorT } from "../../utils/errorType";
import { getProfile } from "../../api/friend";
import { type historyT } from "../../utils/historyType";
import { getPlayerHistory, historyArray } from "../../api/history";
import { useNotif } from "../hooks/useNotif";

type Props = {
  id: number;
  name: string;
  updatedFriends?: boolean;
  logged_in: boolean;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function UsernameMiniProfileBtn({id, name, updatedFriends, logged_in, setUpdate}: Props) {
  const showMiniProfileRef = useRef<HTMLDialogElement>(null);
  	
  const [account, setAccount] = useState<profileT | errorT>({code:200, response:""})
  const [history, setHistory] = useState<historyT[] | errorT>({code:200, response:""});
  const notif = useNotif();

	async function Sendnotif(title:string, message:string) {
		notif?.showNotif(title, message, 5000);
	}

	async function load_mini() {
		if (!logged_in) {
			return ;
		}
		const tmp_account = await getProfile(id);
		if ('code' in tmp_account) {
			Sendnotif("Profile Display Error:", "There was an error display " + name + "'s account!");
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
      <MiniProfile account={account} updatedFriends={updatedFriends} logged_in={logged_in} setUpdate={setUpdate} history={history} profileRef={showMiniProfileRef}/>
    </dialog>
      </>
	);
}