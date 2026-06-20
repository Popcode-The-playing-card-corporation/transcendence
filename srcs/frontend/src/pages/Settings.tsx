import { type Dispatch, type SetStateAction } from "react";
import BlockList from "../components/Settings/BlockList";
import Appareance from "../components/Settings/Appareance";
import Account from "../components/Settings/Account";
import { useAuth } from "../components/hooks/useAuth";


export function Settings({
  setFontChoice,
}: {
  setFontChoice: Dispatch<SetStateAction<string>>;
}) {
	const auth = useAuth();
  return (
    <div className="page-content mt-17">
      <h1 className="text-4xl text-center">Settings</h1>
	  <p>Customize your interface {auth.logged_in ? ", manage your blocklist, and your profile" : null}</p>
      {auth.logged_in ? <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Account</h2>
        </div>
        <div className="collapse-content">
		<Account />
        </div>
      </div> : null}
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Appearance</h2>
        </div>
        <div className="collapse-content">
		<Appareance setFontChoice={setFontChoice}/>
        </div>
      </div>
      {auth.logged_in ? <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">BlockList</h2>
        </div>
         <div className="collapse-content">
		<BlockList />
        </div> 
      </div> : null}
    </div>
  );
}
