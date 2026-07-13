import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";

export default function Chrono() {
	const { state } = useGame(); 
	const [stopWatch, setStopWatch] = useState<number>(Math.floor((new Date().getTime() -state.game.boardData.started_at.getTime()) / 1000));


	useEffect(() => {

	const intervalId = setInterval(() => {
			setStopWatch(Math.floor((new Date().getTime() - state.game.boardData.started_at.getTime()) / 1000));
	}, 1000)

	return () => clearInterval(intervalId)

	}, [state.game.boardData.started_at])
	const sec = stopWatch % 60;
	const min = Math.floor(stopWatch / 60) ;
	return (
<div className="grid grid-flow-col gap-2 text-center auto-cols-max">
  <div className="flex flex-col p-2 rounded-box text-neutral-content bg-primary">
    <span className="countdown font-mono text-2xl">
      <span style={{"--value":min, "--digits": 2}  as React.CSSProperties  } className="">{min}</span>
    </span>
  </div>
  <div className="flex flex-col p-2 rounded-box text-neutral-content bg-primary">
    <span className="countdown font-mono text-2xl">
      <span style={{"--value":sec, "--digits": 2}  as React.CSSProperties } >{sec < 10 ? "0" + sec : sec}</span>
    </span>
  </div>
</div>
	)
}
