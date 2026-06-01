import { type Dispatch, type SetStateAction } from "react";
import BlockList from "../components/Settings/BlockList";
import Appareance from "../components/Settings/Appareance";
import Account from "../components/Settings/Account";


export function Settings({
  setFontChoice,
  islogged,
}: {
  setFontChoice: Dispatch<SetStateAction<string>>;
  islogged:boolean;
}) {

  return (
    <div className="page-content mt-17">
      <h1 className="text-4xl text-center">Settings</h1>
	  <p>Customize your interface and manage your blocklist and your profile</p>
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
        {islogged ? <div className="collapse-content">
		<BlockList />
        </div> : null}
      </div>
    </div>
  );
}
