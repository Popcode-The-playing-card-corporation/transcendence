import { Friends } from "../components/FriendsPart";
import { History } from "../components/HistoryPart";
import { ProfilePart } from "../components/ProfilePart";
import { StatisticsPart } from "../components/StatisticPart";

export function Profile() {
  return (
    <div className=" page-content mt-10">
      <h1>Profile</h1>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title flex items-center gap-6 justify-center">
          <h2 className="text-center">Your profile</h2>
        </div>
        <div className="collapse-content">
          <ProfilePart />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="mb-5 text-center">Friends</h2>
        </div>
        <div className="collapse-content">
          <Friends />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">History</h2>
        </div>
        <div className="collapse-content">
          <History />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Statistics</h2>
        </div>
        <div className="collapse-content">
          <StatisticsPart />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Achievements:</h2>
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
