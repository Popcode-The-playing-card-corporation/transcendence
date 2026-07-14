import { useState } from "react";
import { useNavigate } from "react-router";

type Props = {
	updateachievement: boolean;
}

export function AchievementsPart({updateachievement}:Props) {

	const navigate = useNavigate();
	const [valid, setValid] = useState<boolean | null>(null);
	const [achievement, setachievement] = useState(initialState)<achievementT>(defaultachievement)
	const notif = useNotif();
	const auth = useAuth();
const achievement = tmp_achievement.achievement;

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
      <div style={{
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between"
	}}>
		{achievement.map((player) => (
			<div key={player.title} style={{ 
				padding: "10px",
				borderRadius: "20px",
				backgroundColor: "#000000",
				marginBottom: "10px",
				display: "flex",
				flexDirection: "column",
				width: "500px"
			}}>
				<div style={{
					display: "flex",
				    marginBottom: "10px",
					flexDirection: "row",
					width: "500px"
				}}>
					
					<img src={"/" + player.img} style={{ width: "100px", marginRight: "10px" }}/>
					<div>
						<h2>{player.title}</h2>
						<p>{player.description}</p>
						<p>{player.rate}%</p>
					</div>
				
				</div>

                <progress id="file" value={player.value} max={player.max_value}/>
			</div>
		))}
	</div>
    </div>
  );
