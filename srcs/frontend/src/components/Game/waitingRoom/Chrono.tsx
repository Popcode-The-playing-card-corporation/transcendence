import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";

export default function Chrono() {
	const timeout = useGame().state.settings.timeout;
	const [timeLeft, setTimeLeft] = useState<number>((timeout.getTime() - new Date().getTime()) / 1000) 

	useEffect(() => {

	const intervalId = setInterval(() => {
		setTimeLeft(Math.max( 0, Math.floor((timeout.getTime() - Date.now()) / 1000)));
	}, 1000);

 	 return () => clearInterval(intervalId);
	}, [timeout]);

	const sec = timeLeft % 60;
	const min = Math.floor(timeLeft / 60) ;
	return (
		<div className="grid grid-flow-col gap-2 text-center auto-cols-max">
		<div className="flex flex-col p-2 rounded-box text-neutral-content bg-primary">
			<span className="countdown font-mono text-2xl">
			<span style={{"--value":min, "--digits": 2}  as React.CSSProperties  } className="">{min}</span>
			</span>
		</div>
		<div className="flex flex-col p-2 rounded-box text-neutral-content bg-primary">
			<span className="countdown font-mono text-2xl">
			<span style={{"--value":sec, "--digits": 2}  as React.CSSProperties } >{sec}</span>
			</span>
		</div>
		</div>
	)
}
