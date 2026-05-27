
import { useEffect, useRef, useState } from "react";
import MiniProfile from "./MiniProfile";
import type { profileT } from "../../utils/profileType";
import type { errorT } from "../../utils/errorType";
import { getProfile } from "../../api/friend";
import { type historyT } from "../../utils/historyType";
import { getPlayerHistory, historyArray } from "../../api/history";

type Props = {
  id: number;
  name: string;
  // showMiniProfileRef: Ref<HTMLDialogElement>;
  updatedFriends: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsernameMiniProfileBtn({id, name, updatedFriends, setUpdate}: Props) {
  const showMiniProfileRef = useRef<HTMLDialogElement>(null);
  	
  const [account, setAccount] = useState<profileT | errorT>({code:200, response:""})
  const [history, setHistory] = useState<historyT[] | null>(null);
	useEffect(() => {
		async function retrieveProfile(id:number) {
			const tmp_account = await getProfile(id);
			setAccount(tmp_account);
			return ;
		}

		async function retrieveHistory(id:number) {
			const gameHistory = await getPlayerHistory(id);
			if ("code" in gameHistory) {
				return ;
			}
			setHistory(await historyArray(gameHistory));
			return ;
		}
		retrieveProfile(id);
		retrieveHistory(id);  
  
	}, [id])

	if ('code' in account) {
		return (name);
	}
	
	return (
    <>
    <button
      className="link-hover"
      onClick={() => showMiniProfileRef.current?.showModal()}
    >
    {name}
    </button>
    <dialog
      id="showMiniProfile"
      className="modal"
      ref={showMiniProfileRef}
    >
      <MiniProfile account={account} updatedFriends={updatedFriends} setUpdate={setUpdate} history={history}/>
    </dialog>
      </>
	);
}