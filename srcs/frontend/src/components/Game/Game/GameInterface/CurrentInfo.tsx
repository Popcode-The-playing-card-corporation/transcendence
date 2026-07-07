import { TbClubsFilled } from "react-icons/tb";
import { TiHeartFullOutline } from "react-icons/ti";
import { BsFillSuitDiamondFill, BsFillSuitSpadeFill } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";
import type { playerScoreT } from "../../../../utils/type/boardDataType";

function DisplayTrumpLogo({ trump }: { trump: string | null }) {
  if (trump === "club") {
    return <TbClubsFilled />;
  } else if (trump === "heart") return <TiHeartFullOutline />;
  else if (trump === "diamond") return <BsFillSuitDiamondFill />;
  else if (trump === "spade") return <BsFillSuitSpadeFill />;
  else return <FaQuestion />;
}

function DisplayWhoPlaying({
  self,
  username,
}: {
  self: boolean;
  username: string | undefined;
}) {
  if (username) {
    if (self) {
      return <p className="text-warning font-bold">You are playing!</p>;
    } else {
      return (
        <p>
          <em>{username}</em> is playing...
        </p>
      );
    }
  } else {
    return <p>trick over!</p>;
  }
}

function DisplayGoal({
  limit,
  valueLimit,
  currentGame,
  currentPoints,
}: {
  limit: string;
  valueLimit: number;
  currentGame: number;
  currentPoints: playerScoreT[];
}) {
  if (limit === "points") {
    function compareFn(a: playerScoreT, b: playerScoreT): number {
      if (a.score > b.score) return 0;
      else return 1;
    }
    const currentSortedPoint = currentPoints.sort((a, b) => compareFn(a, b));
    const currentMaxPoint = currentSortedPoint.at(0)?.score;

    return (
      <p>
        {currentMaxPoint}/{valueLimit} points
      </p>
    );
  } else if (limit === "round") {
    return (
      <p>
        Round {currentGame + 1} of {valueLimit}
      </p>
    );
  }
}

export default function CurrentInfo() {
  const { state } = useGame();
  const trump = state.game.boardData.trick;
  const currentPlayer = state.game.boardData.playing;
  const asked = state.game.boardData.asked?.color;
  const nameCurrentPlayer = state.game.boardData.player_list.find(
    (player) => player.room_id === currentPlayer,
  );
  const self = nameCurrentPlayer?.user.username === state.user;
  const timeout = state.game.boardData.round_time;
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.floor((timeout.getTime() - new Date().getTime()) / 1000),
  );
  const limit = "round";
  const limitValue = 3;
  const currentGame = state.game.boardData.game;
  const currentPoints = state.game.boardData.points;

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

  return (
    <div className="border-y border-primary mt-2 py-2 w-full flex flex-col items-center">
      <DisplayGoal
        currentGame={currentGame}
        currentPoints={currentPoints}
        limit={limit}
        valueLimit={limitValue}
      />
      <div className="flex gap-6">
        <p className="flex items-center gap-1">
          Atout: <DisplayTrumpLogo trump={trump} />{" "}
        </p>
        <p className="flex items-center gap-1">
          Asked: <DisplayTrumpLogo trump={asked} />{" "}
        </p>
      </div>
      {/* {state.game.boardData.last_fold.username.length === 0 ? null : ( */}
      {/*   <p className="flex items-center gap-1"> */}
      {/*     Last hand taken by: {state.game.boardData.last_fold.username} */}
      {/*   </p> */}
      {/* )} */}
      <DisplayWhoPlaying
        self={self}
        username={nameCurrentPlayer?.user.username}
      />
      {state.event === "finish_round" ? (
        <p className="flex items-center gap-1">
          Next fold in:{" "}
          <strong>
            {Math.max(0, timeLeft - (state.game.boardData.round === 0 ? 20 : 9))}s
          </strong>
        </p>
      ) : null}
      {state.game.boardData.lastCard ? (
        <p className="flex items-center gap-1">
          <strong>
            Left over card: {state.game.boardData.lastCard.value + " "}{" "}
          </strong>
          <DisplayTrumpLogo trump={state.game.boardData.lastCard.color} />{" "}
        </p>
      ) : null}
    </div>
  );
}
