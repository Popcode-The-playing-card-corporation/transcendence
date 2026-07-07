import { useEffect, useState, type SetStateAction } from "react";
import { getHistory, historyArray } from "../api/http/history";
import type { historyT } from "../utils/type/historyType";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";
import { History } from "../components/Profile/HistoryPart";
import type { errorT } from "../utils/type/errorType";
import { defaultLeaderboard, type leaderboardT } from "../utils/type/leaderboardType";
import { getLeaderboard, leaderboardArray } from "../api/http/leaderboard";
import { friendArray, getFriends } from "../api/http/friend";
import type { friendT, requestT } from "../utils/type/friendType";

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

export function Home({ updatedProfile, setUpdate }: Props) {

  const [leaderboard, setLeaderboard] = useState<leaderboardT>(defaultLeaderboard)
  const [gameHistory, setHistory] = useState<historyT[] | errorT>([]);
  const [friends, setFriends] = useState<friendT[]>([]);
  const [requests, setRequests] = useState<requestT[]>([]);
  const notif = useNotif();
  const auth = useAuth();

  useEffect(() => {
    async function retreiveHistory() {
      const gameHistory = await getHistory();
      if (!("code" in gameHistory)) {
        setHistory(await historyArray(gameHistory));
      } else {
        setHistory({ code: 404, response: "error" })
      }
    }

    async function retreiveLeaderboard() {

      const tmp_leaderboard = await getLeaderboard(auth.logged_in);
      if (!("code" in tmp_leaderboard)) {
        setLeaderboard(leaderboardArray(tmp_leaderboard));
      }
      // else IDK ??
    }

    async function retreiveFriends() {

      const friendlist = await getFriends();
      if (!("code" in friendlist)) {
        const arr = friendArray(friendlist);
        const filter = getRequests(arr);
        setFriends(filter.friends.filter((friend) => friend.user.is_online === true));
        setRequests(filter.requests);
      }
      // else IDK
    }

    retreiveHistory();
    retreiveLeaderboard();
    retreiveFriends();
  }, [notif])


  return (
    <>
      {auth.logged_in ? (
        < div className="page-content mt-17">
          <h1>Home</h1>
          <div>
            <p>
              Welcome to our beautiful game! Go check the{" "}
              <a className="underline" href="/rules">
                rules
              </a>.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bordered border-accent col-span-2">
              <h2 className="text-center">Profile</h2>
              <div className="pt-4">
                <h3>Last games</h3>
                <div>
                  {!("code" in gameHistory) ?
                    <History gameHistory={gameHistory} setUpdate={setUpdate} updatedProfile={updatedProfile} isHome={true} /> : "Error about game history"}
                </div>
              </div>
              <div className="pt-6">
                <h3>Leaderboard</h3>
                {leaderboard.current.username === "" && leaderboard.current.score === 0 && leaderboard.current.rank === 0 ? null :
                  <ul className="h-12 border-b-4 border-base-200">
                    <li className="ms-8">Your rank : {leaderboard.current.rank}</li>
                    <li className="ms-8"> Your score : {leaderboard.current.score}</li>
                  </ul>}
              </div>
            </div>
            <div className="bordered border-accent">
              <h2 className="text-center">Friends</h2>
              <div className="pt-4">
                <h3>Online</h3>
                <div>
                  {friends.length === 0 ?
                    <p className="text-center">You don't have any friends online, go make some !</p>
                    :
                    (friends.map((friend: friendT) => {
                      return (
                        <p>{friend.user.username}</p>
                      )
                    }))
                  }
                </div>
              </div>
              <div className="pt-4">
                <p><strong>Requests</strong> : {requests.length}</p>

              </div>
            </div>
          </div>
        </div >
      ) : (
        <p>You are not logged in.</p>
      )
      }
    </>
  );
}
