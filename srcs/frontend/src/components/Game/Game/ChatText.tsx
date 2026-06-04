import type { chatT } from "../../../utils/type/chatT";

export default function ChatText({info}: {info: chatT}) {
  const isOtherPlayers = true;

  return (
    <div className={"chat " + (isOtherPlayers ? "chat-start": "chat-end")}>
      <div className="chat-header">
        {info.username}
        <time className="text-xs opacity-50">{info.time}</time>
      </div>
      <div className="chat-bubble bg-(--hover-color)">
        {info.message}
      </div>
    </div>
  );
}