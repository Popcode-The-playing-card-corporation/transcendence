import { useState } from "react";
import { callNotifPopUp } from "../utils/callNotifPopUp";

export function TestNotifPopUp() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");

	return (
		<form>
		<label id="title">Title</label>
		<input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)}/>
		<label id="body">Body</label>
		<input type="text" name="body" id="body" onChange={(e) => setBody(e.target.value)}/>
		<input type="submit" onClick={ () => callNotifPopUp(title, body)}/>
		</form>
	)
}
