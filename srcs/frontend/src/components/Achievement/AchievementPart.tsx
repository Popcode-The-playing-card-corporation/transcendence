import type { achievementT } from "../../utils/type/achievementType";

export function AchievementPart({tmp_achievement}:{tmp_achievement:achievementT}) {

  const achievement = tmp_achievement.achievement;
  return (
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
  );
}
