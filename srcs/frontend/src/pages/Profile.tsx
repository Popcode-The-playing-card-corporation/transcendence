import { useLocation, useNavigate } from "react-router";
import React, { useState, useEffect, type SetStateAction } from "react";
import { Friends } from "../components/Profile/FriendsPart";
import { History } from "../components/Profile/HistoryPart";
import { ProfilePart } from "../components/Profile/ProfilePart";
import { StatisticsPart } from "../components/Profile/StatisticPart";
import { defaultStat, type statisticsT } from "../utils/type/statisticsType";
import { getStats } from "../api/http/stats";
import { type friendT, type requestT } from "../utils/type/friendType";
import { friendArray, getFriends, getRecs, getUsers } from "../api/http/friend"
import { defaultAccount, type accountT } from "../utils/type/accountType";
import { profileRequest } from "../api/http/profile";
import { type historyT } from "../utils/type/historyType";
import { getHistory, historyArray } from "../api/http/history";
import { useNotif } from "../components/hooks/useNotif";
import type { recommendationT } from "../utils/type/recommendationType";
import { useAuth } from "../components/hooks/useAuth";

const avatar1 = "/avatars/avatar1.png";

function getRequests(friend_list: friendT[]): {
  friends: friendT[];
  requests: requestT[];
} {
  const friends: friendT[] = [];
  const requests: requestT[] = [];

  for (const friend of friend_list) {
    if (friend.can_accept) {
      requests.push({ id: friend.id, username: friend.user.username });
    } else {
      friends.push(friend);
    }
  }
  return { friends: friends, requests: requests };
}

type Props = {
  updatedProfile: boolean,
  setUpdate: React.Dispatch<SetStateAction<boolean>>,
}

export function Profile({ updatedProfile, setUpdate }: Props) {

  const [valid, setValid] = useState<boolean | null>(null);
  const [stats, setStats] = useState<statisticsT>(defaultStat);
  const [friends, setFriends] = useState<friendT[]>([]);
  const [recs, setRecs] = useState<recommendationT[]>([]);
  const [requests, setRequests] = useState<requestT[]>([]);
  const [gameHistory, setHistory] = useState<historyT[]>([])
  const [users, setUsers] = useState<requestT[]>([])
  const [profile, setProfile] = useState<accountT>(defaultAccount);
  const [updatedFriends, setFriendUpdate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notif = useNotif();
  const auth = useAuth();

  useEffect(() => {

    function login_error(title: string, message: string) {
      if (!auth.logging) {
        navigate('/login', { state: "/profile" });
        notif?.showNotif(title, message, 5000);
      }
      setValid(false);
      return;
    }

    function other_error(title: string, message: string) {
      if (location.state) {
        navigate(location.state, { state: "/profile" });
      } else {
        navigate('/', { state: "/profile" })
      }
      notif?.showNotif(title, message, 5000);
      setValid(false);
      return;
    }

    async function verify() {
      const account = await profileRequest();
      if ("code" in account) {
        if (account.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + account.code + ":", account.response);
        }
      }
      if (account.avatar === "") {
        account.avatar = avatar1;
      }
      setProfile(account);
      const friendlist = await getFriends();
      if ("code" in friendlist) {
        if (friendlist.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + friendlist.code + ":", friendlist.response);
        }
      }
      const arr = friendArray(friendlist);
      const filter = getRequests(arr);
      setFriends(filter.friends);
      setRequests(filter.requests);
      const recommendations = await getRecs();
      if ("code" in recommendations) {
        if (recommendations.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + recommendations.code + ":", recommendations.response);
        }
      }
      setRecs(recommendations);
      const list_users = await getUsers();
      if ("code" in list_users) {
        if (list_users.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + list_users.code + ":", list_users.response);
        }
      }
      setUsers(list_users.data);
      const gameHistory = await getHistory();
      if ("code" in gameHistory) {
        if (gameHistory.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + gameHistory.code + ":", gameHistory.response);
        }
      }
      setHistory(await historyArray(gameHistory));
      const stat_vals = await getStats(account.id);
      if ("code" in stat_vals) {
        if (stat_vals.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else {
          return other_error("Error " + stat_vals.code + ":", stat_vals.response);
        }
      }
      setStats(stat_vals);
      setValid(true);
    }
    verify();
  }, [updatedFriends, updatedProfile, navigate, notif, auth.logged_in, auth.logging])

  if (valid === null) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    )
  }


  if (!valid) {
    return;
  }


  return (
    <div className=" page-content mt-17">
      <h1>Profile</h1>
      <div className="bordered collapse collapse-arrow ">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title flex items-center gap-6 justify-center">
          <h2 className="text-center">Your profile</h2>
        </div>
        <div className="collapse-content">
          <ProfilePart realAccount={profile} setUpdate={setUpdate} updatedProfile={updatedProfile} />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow ">
        <input type="checkbox" name="profile-radio" />
        <div className="flex collapse-title justify-center">

          <h2 className={"text-center" + (auth.hasFriendRequest ? " indicator" : "")}>{auth.hasFriendRequest ? <div className="indicator-item badge badge-sm" >New</div> : null}Friends</h2>
        </div>
        <div className="collapse-content overflow-auto">
          <Friends friends={friends} requests={requests} users={users} recs={recs} updatedFriends={updatedFriends} setUpdate={setFriendUpdate} />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">History</h2>
        </div>
        <div className="collapse-content">
          <History gameHistory={gameHistory} setUpdate={setUpdate} updatedProfile={updatedProfile} isHome={false} />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Statistics</h2>
        </div>
        <div className="collapse-content">
          <StatisticsPart stats={stats} />
        </div>
      </div>
    </div>
  );
}
