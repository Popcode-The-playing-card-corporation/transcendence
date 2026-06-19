import { useEffect, useState } from "react";
import Announcement from "./Announcement";
import ChatBtn from "./ChatBtn";
import InfoBtn from "./InfoBtn";
import Chat from "./Chat";
import FunctionnementInfos from "./FunctionnementInfos";

export default function GameButtons() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<boolean>(false);

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

  useEffect(() => {
    if (isChatOpen)
      setNewMessage(false);
  }, [isChatOpen])

  return (
    <div className="h-1/2 flex p-2 flex-col justify-end">
      {isChatOpen ? (
        <Chat setNewMessage={setNewMessage} isAlreadyOpen={isChatOpen}/>
      ) : ""}
      {isInfoOpen ? (
        <FunctionnementInfos />
      ) : ""}
      <div className="flex gap-2 justify-between">
        <div className="flex gap-1">
          <Announcement />
          <div className="indicator">
            {newMessage ? (
              <span className="indicator-item badge bg-(--nav-color) border-2 border-(--accent-color) w-1 "></span>
            ) : ""}
            <ChatBtn changeState={changeState} />
          </div>
        </div>
        <InfoBtn changeState={changeState} />
      </div>
    </div>
  );
}
