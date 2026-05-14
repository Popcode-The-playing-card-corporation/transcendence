import { useEffect, useState } from "react";

export function NotifPopUp() {
  const [progress, setProgress] = useState(0);
  const [reference, setReference] = useState(0);

  useEffect(() => {
	  setReference(new Date().getSeconds());
	  setProgress(100)

  }, [reference])
  setInterval(() => {
    if (progress > 0) setProgress(progress - 1);
	else setProgress(0)
  }, 100);

  return (
    <div
      className={
        "notif-container w-full flex items-center justify-center " +
        (progress === 0 ? "hidden" : "")
      }
    >
      <div className="top-17 fixed w-1/2 text-center bg-(--hover-color) z-100 rounded-b-4xl px-2 pb-2 shadow-2xl">
        <progress
          className="progress w-full h-0.5"
          value={progress}
          max="100"
        ></progress>
        <p>Tu es seul!</p>
        <p>
          Voilà, je suis une notification et je voulais juste te le rappeler au
          cas où les voix dans ta tête te font penser le contraire...
        </p>
        <p>Donc oui, tu es seul!</p>
      </div>
    </div>
  );
}
