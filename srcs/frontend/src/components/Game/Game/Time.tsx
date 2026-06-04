import { useEffect, useState } from "react";
import Chrono from "./Chrono";

export default function Time() {
	const [timeLeft, setTimeLeft] = useState<number>(15) // new to calculate with backend

	useEffect(() => {

	const intervalId = setInterval(() => {
		if (timeLeft > 0)
			setTimeLeft(timeLeft - 1)
		else 
			setTimeLeft(15)
	}, 1000)

	return () => clearInterval(intervalId)
	})
  return (
    <div className="flex justify-around items-center w-full">
      <div
        className="radial-progress"
        style={{ "--value": timeLeft / 15 * 100, "--size": "50px", "color": "var(--nav-color)"}  as React.CSSProperties }
        aria-valuenow={timeLeft}
        role="progressbar"
		aria-valuemax={15}
      >
	  {timeLeft}s
      </div>
	  <Chrono />
    </div>
  );
}
