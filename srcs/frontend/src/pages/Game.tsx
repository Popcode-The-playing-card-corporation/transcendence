import { useEffect, useRef, useState } from "react";
import CreateOrJoin from "../components/Game/createOrJoin/CreateOrJoin";
import GameWebSocket from "../components/Game/GameWebSocket";
import { useAuth } from "../components/hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { useNotif } from "../components/hooks/useNotif";
import { type availableGameT } from "../utils/type/availableGameType";
import { getJoinedRoom, listRooms } from "../api/http/game";

export function Game() {

	const [isInWaitingRoom, setIsInWaitingRoom] = useState<boolean>(false);
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const notif = useRef(useNotif());
	const [valid, setValid] = useState<boolean | null>(null);
	const [rooms, setRooms] = useState<availableGameT[]>([]);
	const [joined, setJoined] = useState("");

  	useEffect(() => {
  
		function login_error(title:string, message:string) {
			if (!auth.logging) {
				navigate('/login', {state: "/game"});
				notif.current?.showNotif(title, message, 5000);
			}
			setValid(false);
			return ;
		}

		function other_error(title:string, message:string) {
			if (location.state) {
				navigate(location.state, {state: "/game"});
			} else {
				navigate('/', {state: "/game"})
			}
			notif.current?.showNotif(title, message, 5000);
			setValid(false);
			return ;
		}

		async function get_info() {

			let tmp_joined = await getJoinedRoom();
			if ("code" in tmp_joined) {
				if (tmp_joined.code === 401) {
					return login_error("Authentication error:", "Please log in again.");
				} else if (tmp_joined.code === 404) {
					tmp_joined = {room: ""};
				} else {
					return other_error("Error " + tmp_joined.code + ":", tmp_joined.response);
				}
			}
			if (localStorage.getItem("code")) {
				tmp_joined.room = localStorage.getItem("code")
			}
			setJoined(tmp_joined.room);
			if (tmp_joined.room !== "")
			{
				setValid(true);
				return ;
			}
			const tmp_rooms = await listRooms();
			if ("code" in tmp_rooms) {
				if (tmp_rooms.code === 401) {
					return login_error("Authentication error:", "Please log in again.");
				} else {
					return other_error("Error " + tmp_rooms.code + ":", tmp_rooms.response);
				}
			}
			setRooms(tmp_rooms);
			setValid(true);
		}
		get_info();

	}, [auth.logging, navigate, location.state, notif])

	if (valid === null) {
		return (
			<div className="page-content flex items-center justify-center min-h-screen">
				<span className="loading loading-spinner loading-xl"></span>
			</div>
		)
	}


	if (!valid) {
		return ;
	}

	if (joined !== "") {
		return (
			<GameWebSocket code={joined} setCode={setJoined}/>
		)
	}

  return (
    <>
      <label className="mt-20 -mb-17 text-center ">
        Switch waitingRoom or choose create/join game
        <input
          type="checkbox"
          defaultChecked
          className="toggle ml-5"
          onChange={() => setIsInWaitingRoom(!isInWaitingRoom)}
        />
      </label>
        <CreateOrJoin availableGames={rooms} setJoined={setJoined}/>
    </>
  );
}
