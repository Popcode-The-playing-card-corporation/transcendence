import type { Dispatch, SetStateAction } from "react";
import type { historyT } from "../../utils/type/historyType";
import { History } from "../Profile/HistoryPart";
import type { leaderboardT } from "../../utils/type/leaderboardType";
import type { errorT } from "../../utils/type/errorType";

type Props = {
  gameHistory: historyT[] | errorT,
  setUpdate: Dispatch<SetStateAction<boolean>>,
  updatedProfile: boolean,
  leaderboard: leaderboardT | errorT
}

export default function HomeProfile({ gameHistory, setUpdate, updatedProfile, leaderboard }: Props) {
  return (
    <>
      <h2 className="text-center">Profile</h2>
      <div className="pt-4">
        <h3>Last games</h3>
        <div className=" overflow-x-auto">
          {!("code" in gameHistory) ?
            <History gameHistory={gameHistory} setUpdate={setUpdate} updatedProfile={updatedProfile} isHome={true} /> : "Error about game history in HomeProfile"}
        </div>
      </div>
      <div className="pt-6">
        <h3>Leaderboard</h3>
        {!("code" in leaderboard) ?
          (leaderboard.current.username === "" && leaderboard.current.score === 0 && leaderboard.current.rank === 0 ? null :
            <ul className="h-12 border-b-4 border-base-200">
              <li className="ms-8">Your rank : {leaderboard.current.rank}</li>
              <li className="ms-8"> Your score : {leaderboard.current.score}</li>
            </ul>)
          : "Error about leaderboard in HomeProfile"
        }
      </div>
    </>
  );
}