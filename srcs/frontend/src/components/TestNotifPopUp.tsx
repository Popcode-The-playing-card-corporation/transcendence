import { useState } from "react";
import { useNotif } from "./hooks/useNotif";

export function TestNotifPopUp() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
	const [duration, setDuration] = useState(10000);
 const notif  = useNotif();

  return (
    <div className="">
      <div className="mx-auto flex flex-col items-center">
        <label className="label" id="title">
          Title
        </label>
        <input
          className="input"
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <label id="body" className="label">
          Body
        </label>
        <input
          className="input"
          type="text"
          name="body"
          id="body"
          onChange={(e) => setBody(e.target.value)}
        />
				<label id="duration">duration</label>
				<input type="range" min={5000} max={50000} defaultValue={10000} onChange={(e) => setDuration(+e.target.value)}/>
        <button  className="btn mt-4" onClick={() => notif?.showNotif(title, body, duration)}>Submit</button> 
      </div>
    </div>
  );
}
