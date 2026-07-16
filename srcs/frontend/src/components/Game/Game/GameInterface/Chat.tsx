import { IoSend } from "react-icons/io5";
import ChatText from "./ChatText"
import { useEffect, useRef, useState, type SetStateAction, type KeyboardEvent } from "react";
import { useGame } from "../../context/GameContext";

type Props = {
  setNewMessage: React.Dispatch<SetStateAction<boolean>>,
  isAlreadyOpen: boolean,
  setCount: React.Dispatch<SetStateAction<number>>
}

export default function Chat({ setNewMessage, isAlreadyOpen, setCount }: Props) {
  const game = useGame();
  const messages = game.state.messages;
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const messageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter")
      buttonRef.current?.click();
  };

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    async function setterMessage() {
      if (!isAlreadyOpen)
        setNewMessage(true);
      else
        setCount(game.state.messages.length);
    }
    setterMessage();
  }, [messages, setNewMessage, isAlreadyOpen])

  if (!messages)
    return (null);

  function handleSend() {
    if (message.trim().length !== 0) {
      game.sendMessage("chat_message", message);
      setMessage("");
    }
  }

  return (
    <div
      className="dropdown-scroll space-y-2 "
      ref={messageEndRef}
    >
      {messages.map((message) => {
        return (
          <>
            <ChatText info={message} key={messages.indexOf(message)} />
          </>
        );
      })}
      <div className="join w-full sticky -bottom-5 pb-4 bg-base-100 " onKeyDown={handleKeyDown}>
        <input id="chatInput" name="chatInput" type="text" placeholder="Type here" className="input join-item" value={message} onChange={messageChange} />
        <button ref={buttonRef} className="btn join-item" onClick={handleSend} >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
