import { IoSend } from "react-icons/io5";
import generateFakeChat from "../../../utils/test_funcs/generateFakeChat";
import ChatText from "./ChatText"

export default function Chat() {
  const messages = generateFakeChat();

  return (
    <div className="bordered-wmp bg-(--nav-color) max-h-3/4 overflow-scroll space-y-2">
      {messages.map((message) => {
        return (
          <>
            <ChatText info={message}/>
          </>
        );
      })}
      <div className="join w-full sticky -bottom-5 pb-4 bg-(--nav-color) ">
        <input type="text" placeHolder="Type here" className="input join-item" />
        <button className="btn join-item" >
          <IoSend />
        </button>
      </div>
    </div>
  );
}