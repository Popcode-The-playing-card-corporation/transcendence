import { useNavigate } from "react-router";
import { LeaderboardPart } from "../components/Leaderboard/LeaderboardPart";
import { defaultLeaderboard, type leaderboardT } from "../utils/type/leaderboardType";
import { useEffect, useState } from "react";
import { getLeaderboard, leaderboardArray } from "../api/http/leaderboard";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";

type Props = {
	updateLeaderboard: boolean;
}
export function Leaderboard({updateLeaderboard}:Props) {

	const navigate = useNavigate();
	const [valid, setValid] = useState<boolean | null>(null);
	const [leaderboard, setLeaderboard] = useState<leaderboardT>(defaultLeaderboard)
	const notif = useNotif();
	const auth = useAuth();

	useEffect(() => {

		function other_error(message:string) {
			navigate('/', {state: location.pathname});
			notif?.showNotif("Unknown Error", message, 5000);
			setValid(false);
			return ;
		}

		async function load_leaderboard() {
			
			const tmp_leaderboard = await getLeaderboard(auth.logged_in);
			if ("code" in tmp_leaderboard) {
				return other_error(tmp_leaderboard.response);
			}
			setLeaderboard(leaderboardArray(tmp_leaderboard));
			setValid(true);
		}
		load_leaderboard();
	}, [navigate, auth.logged_in, notif, updateLeaderboard])

	if (valid === null) {
	  return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>
	);
	}

	if (!valid) {
		navigate('/', {state: location.pathname});
		setValid(false);
		return ;
	}

  return (
    <div className="page-content my-17">
      <h1>Leaderboard</h1>
      <LeaderboardPart tmp_leaderboard={leaderboard}/>
    </div>
  );
}
