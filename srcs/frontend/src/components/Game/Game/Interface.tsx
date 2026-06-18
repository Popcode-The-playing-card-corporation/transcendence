import LeaderboardInGame from "./GameInterface/LeaderboardInGame";
import GameButtons from "./GameInterface/GameButtons";
import EndingModal from "./GameInterface/EndingModal";
import { type Dispatch, type SetStateAction } from "react";

export default function Interface(
{
  isEnd,
  setIsEnd,
}: {
  isEnd: boolean;
  setIsEnd: Dispatch<SetStateAction<boolean>>;
}
) {

  return (
    <div className="w-1/4 h-full ">
      {/* <button className="btn btn-cicrle" onClick={() => setIsEnd(true)}> INFO: For sim end modal*/} 
      {/*   sim end */}
      {/* </button> */}
      <LeaderboardInGame />
      <GameButtons />
      <EndingModal isEnd={isEnd} setIsEnd={setIsEnd} />
    </div>
  );
}
