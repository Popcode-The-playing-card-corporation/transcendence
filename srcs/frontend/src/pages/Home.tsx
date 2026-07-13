import { useEffect, useState } from "react";
import { getHistory, historyArray } from "../api/http/history";
import type { historyT } from "../utils/type/historyType";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";
import type { errorT } from "../utils/type/errorType";
import { defaultLeaderboard, type leaderboardT } from "../utils/type/leaderboardType";
import { getLeaderboard, leaderboardArray } from "../api/http/leaderboard";
import { friendArray, getFriends } from "../api/http/friend";
import type { friendT, requestT } from "../utils/type/friendType";
import HomeProfile from "../components/Home/HomeProfile";
import HomeFriends from "../components/Home/HomeFriends";
import AboutPage from "../components/Home/AboutPage";

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

export function Home() {

  const [leaderboard, setLeaderboard] = useState<leaderboardT | errorT>(defaultLeaderboard);
  const [gameHistory, setHistory] = useState<historyT[] | errorT>([]);
  const [friends, setFriends] = useState<friendT[] | errorT>([]);
  const [requests, setRequests] = useState<requestT[] | errorT>([]);
  const notif = useNotif();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.logged_in)
      return;

    async function retreiveHistory() {
      const gameHistory = await getHistory();
      if (!("code" in gameHistory)) {
        setHistory(await historyArray(gameHistory));
      } else {
        setHistory({ code: 404, response: "error" });
      }
    }

    async function retreiveLeaderboard() {

      const tmp_leaderboard = await getLeaderboard(auth.logged_in);
      if (!("code" in tmp_leaderboard)) {
        setLeaderboard(leaderboardArray(tmp_leaderboard));
      }
      else
        setLeaderboard({ code: 404, response: "error" });
    }

    async function retreiveFriends() {

      const friendlist = await getFriends();
      if (!("code" in friendlist)) {
        const arr = friendArray(friendlist);
        const filter = getRequests(arr);
        setFriends(filter.friends.filter((friend) => friend.user.is_online === true));
        setRequests(filter.requests);
      }
      else {
        setFriends({ code: 404, response: "error" });
        setRequests({ code: 404, response: "error" });
      }
    }

    retreiveHistory();
    retreiveLeaderboard();
    retreiveFriends();
  }, [notif])


  return (
    <>
      < div className="page-content mt-17">
        <h1>Home</h1>
        {auth.logged_in ? (
          <div className="grid grid-cols-3 grid-flow-row-dense gap-6">
            <div className="bordered border-accent col-span-2 max-lg:col-span-3">
              <HomeProfile gameHistory={gameHistory} leaderboard={leaderboard} />
            </div>
            <div className="bordered border-accent max-lg:col-span-3">
              <HomeFriends friends={friends} requests={requests} />
            </div>
          </div>
        ) : (
          <AboutPage />
        )}
      </div >
    </>
  );
}
