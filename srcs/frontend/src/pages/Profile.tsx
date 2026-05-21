import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { checkAuth } from "../api/checkAuth";
import { Friends } from "../components/FriendsPart";
import { History } from "../components/HistoryPart";
import { ProfilePart } from "../components/ProfilePart";
import { StatisticsPart } from "../components/StatisticPart";
import { defaultStat, type statisticsT } from "../utils/statisticsType";
import { getStats } from "../api/stats";
import { type friendT, type requestT } from "../utils/friendType";
import { friendArray, getFriends } from "../api/friend"
import { defaultAccount, type accountT } from "../utils/accountType";
import { profileRequest } from "../api/profile";
import avatar1 from "../assets/avatars/avatar1.png";
import { type historyT } from "../utils/historyType";
import { getHistory, historyArray } from "../api/history";

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

export function Profile() {

	const [valid, setValid] = useState<boolean | null>(null);
	const [stats, setStats] = useState<statisticsT>(defaultStat);
	const [friends, setFriends] = useState<friendT[]>([]);
	const [requests, setRequests] = useState<requestT[]>([]);
	const [gameHistory, setHistory] = useState<historyT[]>([])
	const [profile, setProfile] = useState<accountT>(defaultAccount);
	const [updatedProfile, setUpdate] = useState(false);
  	const [updatedFriends, setFriendUpdate] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {

		function login_error(message:string) {
			navigate('/login', {state: location.pathname});
			// notif bar
			console.debug(message);
			setValid(false);
			return ;
		}

		function other_error(message:string) {
			navigate('/home', {state: location.pathname});
			// notif bar
			console.debug(message);
			setValid(false);
			return ;
		}

		async function verify() {
			if (!(await checkAuth())) {
				return login_error("Authentication error");
			}
			const account = await profileRequest();
			if ("code" in account) {
				if (account.code === 401) {
					return login_error("Authentication error, please log in.");
				} else {
					return other_error(account.response);
				}
			}
			if (account.avatar === "") {
				account.avatar = avatar1;
			}
			setProfile(account);
			const friendlist = await getFriends();
			if ("code" in friendlist) {
				if (friendlist.code === 401) {
					return login_error("Authentication error, please log in.");
				} else {
					return other_error(friendlist.response);
				}
			}
			const arr = friendArray(friendlist);
			const filter = getRequests(arr);
			setFriends(filter.friends);
			setRequests(filter.requests);
			const gameHistory = await getHistory();
			if ("code" in gameHistory) {
				if (gameHistory.code === 401) {
					return login_error("Authentication error, please log in.");
				} else {
					return other_error(gameHistory.response);
				}
			}
			setHistory(await historyArray(gameHistory));
			const stat_vals = await getStats(account.id);
			if ("code" in stat_vals) {
				if (stat_vals.code === 401) {
					return login_error("Authentication error, please log in.");
				} else {
					return other_error(stat_vals.response);
				}
			}
			setStats(stat_vals);
			setValid(true);
		}
		verify();
	}, [updatedFriends, updatedProfile, navigate, location])

	if (valid === null) {
		return <p>Loading...</p>;
	}

	if (!valid) {
		navigate('/home', {state: location.pathname});
		// notif bar
		console.debug("");
		setValid(false);
		return ;
	}


  return (
    <div className=" page-content mt-17">
      <h1>Profile</h1>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title flex items-center gap-6 justify-center">
          <h2 className="text-center">Your profile</h2>
        </div>
        <div className="collapse-content">
          <ProfilePart realAccount={profile} setUpdate={setUpdate} updatedProfile={updatedProfile}/>
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Friends</h2>
        </div>
        <div className="collapse-content overflow-auto">
          <Friends friends={friends} requests={requests} updatedFriends={updatedFriends} setUpdate={setFriendUpdate} />
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">History</h2>
        </div>
        <div className="collapse-content">
          <History gameHistory={gameHistory}/>
        </div>
      </div>
      <div className="bordered collapse collapse-arrow">
        <input type="checkbox" name="profile-radio" />
        <div className="collapse-title">
          <h2 className="text-center">Statistics</h2>
        </div>
        <div className="collapse-content">
          <StatisticsPart stats={stats}/>
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
