import { useEffect, useState } from "react";
import { isEnabled, titleNotif, bodyNotif, setIsEnabled } from "../utils/notifPopUpVariables";

// type Props = {
//   isEnabled: boolean;
//   title: string;
//   body: string;
// };

export function NotifPopUp() {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (progress > 0) setProgress(progress - 1);
      else {
        setProgress(0);
		setIsEnabled(false)
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [progress]);

  if (!isEnabled) return;
  return (
    <div
      className={
        "notif-container w-full flex items-center justify-center " +
        (progress === 0 ? "hidden" : "")
      }
      onClick={() => setProgress(0)}
    >
      <div className="top-17 fixed w-1/2 text-center bg-(--hover-color) z-100 rounded-b-4xl px-2 pb-2 shadow-2xl ">
        <div className="myProgressBar  w-full h-1 bg-(--font-color) rounded-4xl my-2">
          <div
            className="h-full bg-(--bg-color) transition-all duration-150 rounded-4xl"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <h3>{titleNotif}</h3>
        <p>{bodyNotif}</p>
      </div>
    </div>
  );
}
