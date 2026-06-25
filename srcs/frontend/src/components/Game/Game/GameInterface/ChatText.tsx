import type { chatT } from "../../../../utils/type/chatT";
import { useGame } from "../../context/GameContext";

export default function ChatText({info}: {info: chatT}) {
  const game = useGame();
  const isOtherPlayers = info.user.username !== game.state.user;

  return (
    <div className={"chat " + (isOtherPlayers ? "chat-start": "chat-end")}>
      <div className="chat-header">
        {isOtherPlayers ? (info.user.username) : ""}
        <time className="text-xs opacity-50">{info.time}</time>
      </div>
      <div className="chat-bubble bg-(--hover-color) w-max-3/4">
        {info.message}
      </div>
    </div>
  );
}