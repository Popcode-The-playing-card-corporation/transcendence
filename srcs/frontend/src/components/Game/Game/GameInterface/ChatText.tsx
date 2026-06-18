import type { chatT } from "../../../../utils/type/chatT";

export default function ChatText({info}: {info: chatT}) {
  const isOtherPlayers = true;

  return (
    <div className={"chat " + (isOtherPlayers ? "chat-start": "chat-end")}>
      <div className="text-sm chat-header">
        {info.username}
        <time className="flex justify-center text-xs opacity-50">{info.time}</time>
      </div>
      <div className="chat-bubble bg-(--hover-color) w-max-3/4">
        {info.message}
      </div>
    </div>
  );
}