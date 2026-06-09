import { useEffect, useState } from "react";

export default function Chrono() {
	const [stopWatch, setStopWatch] = useState<number>(0);


	useEffect(() => {

	const intervalId = setInterval(() => {
			setStopWatch(stopWatch + 1);
	}, 1000)

	return () => clearInterval(intervalId)
	})
	const sec = stopWatch % 60;
	const min = Math.floor(stopWatch / 60) ;
	return (
<div className="grid grid-flow-col gap-5 text-center auto-cols-max">
  <div className="flex flex-col p-2 rounded-box text-neutral-content bg-(--nav-color)">
    <span className="countdown font-mono text-2xl">
      <span style={{"--value":min}  as React.CSSProperties  } className="">{min}</span>
    </span>
  </div>
  <div className="flex flex-col p-2 rounded-box text-neutral-content bg-(--nav-color)">
    <span className="countdown font-mono text-2xl">
      <span style={{"--value":sec}  as React.CSSProperties } >{sec}</span>
    </span>
  </div>
</div>
	)
}
