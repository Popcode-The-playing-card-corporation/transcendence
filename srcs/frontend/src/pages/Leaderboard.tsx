import { useNavigate } from "react-router";
import { LeaderboardPart } from "../components/LeaderboardPart";
import { defaultLeaderboard, type leaderboardT } from "../utils/leaderboardType";
import { useEffect, useState } from "react";
import { getLeaderboard, leaderboardArray } from "../api/leaderboard";

export function Leaderboard() {

	const navigate = useNavigate();
	const [valid, setValid] = useState<boolean | null>(null);
	const [leaderboard, setLeaderboard] = useState<leaderboardT>(defaultLeaderboard)

	useEffect(() => {

		function other_error(message:string) {
			navigate('/', {state: location.pathname});
			// notif bar
			console.debug(message);
			setValid(false);
			return ;
		}

		async function load_leaderboard() {
			
			const tmp_leaderboard = await getLeaderboard();
			if ("code" in tmp_leaderboard) {
				return other_error(tmp_leaderboard.response);
			}
			setLeaderboard(leaderboardArray(tmp_leaderboard));
			setValid(true);
		}
		load_leaderboard();
	}, [navigate])

	if (valid === null) {
	  return (
		<div className="page-content mt-17">
			<span className="loading loading-spinner text-secondary"></span>
		</div>
	);
	}

	if (!valid) {
		navigate('/', {state: location.pathname});
		// notif bar
		console.debug("");
		setValid(false);
		return ;
	}

  return (
    <div className="page-content my-17">
      <h1>Leaderboard</h1>
      <LeaderboardPart tmp_leaderboard={leaderboard} />
    </div>
  );
}