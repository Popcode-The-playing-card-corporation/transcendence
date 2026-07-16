import { useRef, useState } from "react";
import MiniProfile from "./MiniProfile";
import type { profileT } from "../../utils/type/profileType";
import type { errorT } from "../../utils/type/errorType";
import { getProfile } from "../../api/http/friend";
import { type historyT } from "../../utils/type/historyType";
import { getPlayerHistory, historyArray } from "../../api/http/history";
import { useNotif } from "../hooks/useNotif";
import { useAuth } from "../hooks/useAuth";

type Props = {
  id: number;
  name: string;
  updatedFriends?: boolean;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsernameMiniProfileBtn({
  id,
  name,
  updatedFriends,
  setUpdate,
}: Props) {
  const showMiniProfileRef = useRef<HTMLDialogElement>(null);

  const [account, setAccount] = useState<profileT | errorT>({
    code: 200,
    response: "",
  });
  const [history, setHistory] = useState<historyT[] | errorT>({
    code: 200,
    response: "",
  });
  const notif = useNotif();
  const auth = useAuth();

  async function Sendnotif(title: string, message: string) {
    notif?.showNotif(title, message, 5000);
  }

  async function load_mini() {
    if (!auth.logged_in || auth.userID === id || (id >= 1 && id <= 6)) {
      return;
    }
    const tmp_account = await getProfile(id);
    if ("code" in tmp_account) {
      Sendnotif(
        "Profile Display Error:",
        "There was an error display " + name + "'s account!",
      );
      return;
    }
    setAccount(tmp_account);
    const gameHistory = await getPlayerHistory(id);
    if ("code" in gameHistory) {
      setHistory(gameHistory);
    } else {
      setHistory(await historyArray(gameHistory));
    }
    showMiniProfileRef.current?.showModal();
    return;
  }

  return (
    <>
      <button className="link-hover" onClick={load_mini}>
        <span className="md:hidden">
          {name.length > 10 ? name.substring(0, 10) + "..." : name}
        </span>
        <span className="max-md:hidden">{name}</span>
      </button>
      <dialog id="showMiniProfile" className="modal" ref={showMiniProfileRef}>
        <MiniProfile
          account={account}
          updatedFriends={updatedFriends}
          setUpdate={setUpdate}
          history={history}
          profileRef={showMiniProfileRef}
        />
      </dialog>
    </>
  );
}
