import { useEffect, useState } from "react";
import Announcement from "./Announcement";
import ChatBtn from "./ChatBtn";
import InfoBtn from "./InfoBtn";
import Chat from "./Chat";
import FunctionnementInfos from "./FunctionnementInfos";
import FoldModal from "./FoldModal";
import { useGame } from "../../context/GameContext";
import GlobalAnnonce from "../GameInterface/GlobalAnnonce";

export default function GameButtons() {
  const game = useGame();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [messageCount, setCount] = useState<number>(game.state.messages.length);

  function changeState(whichButton: string) {
    if (whichButton === "chat") {
      if (!isChatOpen && isInfoOpen)
        setIsInfoOpen(!isInfoOpen);
      setIsChatOpen(!isChatOpen);
    }
    else {
      if (!isInfoOpen && isChatOpen)
        setIsChatOpen(!isChatOpen);
      setIsInfoOpen(!isInfoOpen);
    }
  }

  useEffect(() => {
    async function setMessage() {
      if (isChatOpen) {
        setNewMessage(false);
      }
    }
    setMessage();
  }, [isChatOpen])

  useEffect(() => {
    async function setMessage() {
      if (!isChatOpen && game.state.messages.length !== messageCount && game.state.messages.at(-1)?.user.username !== game.state.user) {
        setNewMessage(true);
        setCount(game.state.messages.length);
      }
    }
    setMessage();
  }, [isChatOpen, game.state.messages, game.state.user, messageCount])

  return (
    <div className="flex p-2 flex-col justify-end ">
      {isChatOpen ? (
        <Chat setNewMessage={setNewMessage} isAlreadyOpen={isChatOpen} setCount={setCount} />
      ) : ""}
      {isInfoOpen ? (
        <FunctionnementInfos />
      ) : ""}
      <div className="flex gap-2 mt-2 items-center justify-between">
        <FoldModal />
        <Announcement />
        <div className="indicator">
          {newMessage ? (
            <span className="indicator-item badge badge-sm">New</span>
          ) : null}
          <ChatBtn changeState={changeState} />
        </div>
        <InfoBtn changeState={changeState} />
      </div>
      <GlobalAnnonce />
    </div>
  );
}
