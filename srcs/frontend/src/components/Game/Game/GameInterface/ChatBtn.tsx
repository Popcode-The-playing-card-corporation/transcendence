import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function ChatBtn({changeState}: {changeState: (whichButton: string) => void}) {
  return (
    <>
      <button
        className="btn btn-lg btn-circle bg-base-100" 
        onClick={() => changeState("chat")}
      >
        <IoChatbubbleEllipsesOutline />
      </button>
    </>
  );
}
