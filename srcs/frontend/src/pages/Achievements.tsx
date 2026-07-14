import { useNavigate } from "react-router";
import { AchievementPart } from "../components/Achievement/AchievementPart";
import { defaultachievement, type achievementT } from "../utils/type/achievementType";
import { useEffect, useState } from "react";
import { getAchievement, achievementArray } from "../api/http/achievement";
import { useNotif } from "../components/hooks/useNotif";
import { useAuth } from "../components/hooks/useAuth";

type Props = {
	updateachievement: boolean;
}
export function Achievements({updateachievement}:Props) {

	const navigate = useNavigate();
	const [valid, setValid] = useState<boolean | null>(null);
	const [achievement, setachievement] = useState<achievementT>(defaultachievement)
	const notif = useNotif();
	const auth = useAuth();

	useEffect(() => {

		function other_error(message:string) {
			navigate('/', {state: location.pathname});
			notif?.showNotif("Unknown Error", message, 5000);
			setValid(false);
			return ;
		}

		async function load_achievement() {
			
			const tmp_achievement = await getAchievement(auth.logged_in);
			if ("code" in tmp_achievement) {
				return other_error(tmp_achievement.response);
			}
			setachievement(achievementArray(tmp_achievement));
			setValid(true);
		}
		load_achievement();
	
	}, [navigate, auth.logged_in, notif, updateachievement])

	if (valid === null) {
	  return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>
	);
	}

	if (!valid) {
		navigate('/', {state: location.pathname});
		// notif bar
		setValid(false);
		return ;
	}

  return (
    <div className="page-content my-17">
      <h1>achievement</h1>
      <AchievementPart tmp_achievement={achievement}/>
    </div>
  );
}