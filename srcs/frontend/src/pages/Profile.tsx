import { useState } from "react";
import { Friends } from "../components/FriendsPart";
import { History } from "../components/HistoryPart";
import { ProfilePart } from "../components/ProfilePart";
import { StatisticsPart } from "../components/StatisticPart";
import type { accountT } from "../utils/accountType";

export function Profile({ accountCurr }: { accountCurr: accountT }) {
  return (
    <div className=" page-content mt-10">
      <h1>Profile</h1>
      {/*   <div className="bordered collapse"> */}
      {/*     <input type="radio" name="profile-radio" /> */}
      {/*     <div className="collapse-title flex items-center gap-6 justify-center"> */}
      {/*       <h2 className="text-center">Your profile</h2> */}
      {/* <IoIosArrowDown className="text-3xl" /> */}
      {/*     </div> */}
      {/*     <div className="collapse-content"> */}
      <ProfilePart accountCurr={accountCurr} />
      {/* </div> */}
      {/* </div> */}
      <div className="bordered collapse">
        <input type="radio" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="mb-5">Friends:</h2>
        </div>
        <div className="collapse-content">
          <Friends />
        </div>
      </div>
      <div className="bordered collapse">
        <input type="radio" name="profile-radio" />
        <div className="collapse-title">
          <h2>History:</h2>
        </div>
        <div className="collapse-content">
          <History />
        </div>
      </div>
      <div className="bordered collapse">
        <input type="radio" name="profile-radio" />
        <div className="collapse-title">
          <h2>Statistics:</h2>
        </div>
        <div className="collapse-content">
          <StatisticsPart />
        </div>
      </div>
      <div className="bordered collapse">
        <input type="radio" name="profile-radio" />
        <div className="collapse-title">
          <h2>Achievements:</h2>
        </div>
        <div className="collapse-content">
          <p>
            Pas encore fait, faut pas pousser mémé dans les orties nan mais ho
          </p>
        </div>
      </div>
    </div>
  );
}
