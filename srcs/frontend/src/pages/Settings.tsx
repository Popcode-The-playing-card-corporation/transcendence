import type { Dispatch, SetStateAction } from "react";
import BlockList from "../components/settings/BlockList";
import Appareance from "../components/settings/Appareance";
import Account from "../components/settings/Account";

export function Settings({
  setFontChoice,
}: {
  setFontChoice: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="page-content mt-17">
      <h1 className="text-4xl text-center">Settings</h1>
	  <p>Custom your interface and manage your blocklist and your profile</p>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Account</h2>
        </div>
        <div className="collapse-content">
		<Account />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Appareance</h2>
        </div>
        <div className="collapse-content">
		<Appareance setFontChoice={setFontChoice}/>
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">BlockList</h2>
        </div>
        <div className="collapse-content">
		<BlockList />
        </div>
      </div>
    </div>
  );
}
