import { useEffect, useState } from "react";
import { useNotif } from "../hooks/useNotif";
import { useAuth } from "../hooks/useAuth";

// type Props = {
//   isEnabled: boolean;
//   title: string;
//   body: string;
// };
//

export function NotifPopUp() {
  const [progress, setProgress] = useState(100);
  const context = useNotif();
  const auth = useAuth();
  const [copied, setCopy] = useState(false);


  useEffect(() => {
    if (!context || !context.isEnabled ) return;

    const intervalId = setInterval(() => {
	  setProgress(100);
      if (progress > 0) setProgress(progress - 1);
      else {
        setProgress(100);
		setCopy(false);
        context.resetNotif();
      }
    }, context.duration / 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [progress, context, context?.isEnabled]); // Maybe remove context

  function copyCode() {
	if (context && context.body) {
		const code = context.body.split(" ").pop() 
		if (code) {
			navigator.clipboard.writeText(code);
		}
		setCopy(true);
	}
	return;
  }

  if (auth.in_game) {
	return ;
  }
  
  if (!context || !context.isEnabled) return;
  else
    return (
      <div
        className={
          "notif-container w-full flex items-center justify-center " +
          (progress === 0 ? "hidden" : "")
        }
        onClick={context.title === "Game Invite" ? copyCode : () => {
          setProgress(100);
          context.resetNotif();
        }}
      >
        <div className="top-16 fixed w-1/2 text-center bg-secondary z-100 rounded-b-4xl px-2 pb-2 shadow-2xl ">
          <div className="myProgressBar  w-full h-1 bg-secondary-content rounded-4xl my-2">
            <div
              className="h-full bg-base-200 transition-all duration-100 rounded-4xl"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <h3>{copied ? "Copied!" : context.title}</h3>
          <p>{context.body}</p>
        </div>
      </div>
    );
}
