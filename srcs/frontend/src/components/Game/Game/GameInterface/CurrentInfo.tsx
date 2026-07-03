import { TbClubsFilled } from "react-icons/tb";
import { TiHeartFullOutline } from "react-icons/ti";
import { BsFillSuitDiamondFill, BsFillSuitSpadeFill } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";

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
      return <p className="text-accent font-bold">You are playing!</p>;
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

export default function CurrentInfo() {
  const { state } = useGame();
  const trump = state.game.boardData.trick;
  const currentPlayer = state.game.boardData.playing;
  const asked = state.game.boardData.asked?.color;
  const nameCurrentPlayer = state.game.boardData.player_list.find(
    (player) => player.room_id === currentPlayer,);
  const self = nameCurrentPlayer?.user.username === state.user;
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

  return (
    <div className="border-y border-primary mt-2 py-2 w-full flex flex-col items-center">
      <p className="flex items-center gap-1">
        Atout: <DisplayTrumpLogo trump={trump} />{" "}
      </p>
      <p className="flex items-center gap-1">
        Asked: <DisplayTrumpLogo trump={asked} />{" "}
      </p>
	  {state.game.boardData.last_fold.username === "" ? null : <p className="flex items-center gap-1">
        Last hand taken by: {state.game.boardData.last_fold.username}
      </p>}
	  {state.game.boardData.lastCard ? <p className="flex items-center gap-1">
        Last Card: {state.game.boardData.lastCard.value + " "} <DisplayTrumpLogo trump={state.game.boardData.lastCard.color} />{" "}
      </p> : null}
	  {state.event === "finish_round"? <p className="flex items-center gap-1">
        Next fold starting in: {timeLeft - (state.game.boardData.round === 0 ? 20 : 9)}s
      </p> : null}
      <DisplayWhoPlaying
        self={self}
        username={nameCurrentPlayer?.user.username}
      />
    </div>
  );
}
