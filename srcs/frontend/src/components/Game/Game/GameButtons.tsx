import { useState } from "react";
import AnnouncementBtn from "./AnnouncementBtn";
import ChatBtn from "./ChatBtn";
import InfoBtn from "./InfoBtn";
import Chat from "./Chat";
import FunctionnementInfos from "./FunctionnementInfos";

export default function GameButtons() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  function changeState(whichButton: string) {
    if (whichButton === "chat")
    {
      if (!isChatOpen && isInfoOpen)
        setIsInfoOpen(!isInfoOpen);
      setIsChatOpen(!isChatOpen);
    }
    else
    {
      if (!isInfoOpen && isChatOpen)
        setIsChatOpen(!isChatOpen);
      setIsInfoOpen(!isInfoOpen);
    }
  }

  return (
    <div className="h-1/2 ">
      <div className="flex gap-2 m-2 items-center justify-between">
        <AnnouncementBtn />
        <div className="flex gap-2 m-2">
          <ChatBtn changeState={changeState} />
          <InfoBtn changeState={changeState} />
        </div>
      </div>
      {isChatOpen ? (
        <Chat/>
      ) : ""}
      {isInfoOpen ? (
        <FunctionnementInfos />
      ) : ""}
    </div>
  );
}