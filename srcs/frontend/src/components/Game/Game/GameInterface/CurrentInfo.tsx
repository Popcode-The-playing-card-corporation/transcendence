import { TbClubsFilled } from "react-icons/tb";
import { TiHeartFullOutline } from "react-icons/ti";
import { BsFillSuitDiamondFill, BsFillSuitSpadeFill } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa";

function DisplayTrumpLogo({ trump }: { trump: string }) {
  if (trump === "club") {
    return <TbClubsFilled />;
  } else if (trump === "heart") return <TiHeartFullOutline />;
  else if (trump === "diamond") return <BsFillSuitDiamondFill />;
  else if (trump === "spade") return <BsFillSuitSpadeFill />;
  else return <FaQuestion />;
}

export default function CurrentInfo() {
  const trump = "club";
  const currentPlayer = "francis lalanne";

  return (
    <div className="border-y border-(--hover-color) mt-2 py-2 w-full flex flex-col items-center">
      <p className="flex items-center gap-1">
        Atout: <DisplayTrumpLogo trump={trump} />{" "}
      </p>
      <p><em>{currentPlayer}</em>  is playing</p>
    </div>
  );
}
