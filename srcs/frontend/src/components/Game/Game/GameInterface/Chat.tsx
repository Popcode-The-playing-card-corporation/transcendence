import { IoSend } from "react-icons/io5";
import generateFakeChat from "../../../../utils/test_funcs/generateFakeChat";
import ChatText from "./ChatText"
import { useEffect, useRef, type KeyboardEvent, type SetStateAction } from "react";

type Props = {
  setNewMessage: React.Dispatch<SetStateAction<boolean>>
  isAlreadyOpen: boolean
}

export default function Chat({setNewMessage, isAlreadyOpen}: Props) {
  const messages = generateFakeChat();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter")
      console.log(`Key pressed: ${event.key}`);
  };

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    if (!isAlreadyOpen)
      setNewMessage(true);
  }, [messages])

  if (!messages)
    return (null);

  return (
    <div
      className="dropdown-scroll space-y-2"
      ref={messageEndRef}
    >
      {messages.map((message) => {
        return (
          <>
            <ChatText info={message}/>
          </>
        );
      })}
      <div ref={messageEndRef}></div>
      <div className="join w-full sticky -bottom-5 pb-4 bg-(--nav-color) " onKeyDown={handleKeyDown}>
        <input type="text" placeholder="Type here" className="input join-item" />
        <button className="btn join-item" >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
