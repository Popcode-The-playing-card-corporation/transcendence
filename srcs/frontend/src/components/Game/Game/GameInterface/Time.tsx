import { useEffect, useState } from "react";
import Chrono from "../GameInterface/Chrono";
import { useGame } from "../../context/GameContext";
import ExitBtn from "./ExitBtn";

export default function Time() {
  const { state } = useGame();
  const selfTurn = state.game.boardData.self_id == state.game.boardData.playing;
  const timeout = state.game.boardData.round_time;
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.floor((timeout.getTime() - new Date().getTime()) / 1000),
  );

  useEffect(() => {
    async function setTime() {
      setTimeLeft(
        Math.max(0, Math.floor((timeout.getTime() - Date.now()) / 1000)),
      );
    }

    setTime();

    const intervalId = setInterval(() => {
      setTimeLeft(
        Math.max(0, Math.floor((timeout.getTime() - Date.now()) / 1000)),
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.game.boardData.round_time]);

  if (!selfTurn || state.event === "finish_round") {
    return (
      <div className="flex justify-around items-center w-full min-h-12.5">
        <Chrono />
        <ExitBtn />
      </div>
    );
  }

  return (
    <div className="flex justify-around items-center w-full">
      <div
        className="radial-progress"
        style={
          {
            "--value": (timeLeft / 15) * 100,
            "--size": "50px",
            color: "var(--color-primary)",
          } as React.CSSProperties
        }
        aria-valuenow={timeLeft}
        role="progressbar"
        aria-valuemax={15}
      >
        {timeLeft}s
      </div>
      <Chrono />
      <ExitBtn />
    </div>
  );
}
