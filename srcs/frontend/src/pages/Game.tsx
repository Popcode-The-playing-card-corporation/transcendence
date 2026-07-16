import { useEffect, useRef, useState } from "react";
import CreateOrJoin from "../components/Game/createOrJoin/CreateOrJoin";
import GameWebSocket from "../components/Game/GameWebSocket";
import { useAuth } from "../components/hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { useNotif } from "../components/hooks/useNotif";
import { type availableGameT } from "../utils/type/availableGameType";
import { getJoinedRoom, listRooms, validateRoom } from "../api/http/game";

export function Game() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notif = useRef(useNotif());
  const [valid, setValid] = useState<boolean | null>(null);
  const [rooms, setRooms] = useState<availableGameT[]>([]);
  const [joined, setJoined] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    function login_error(title: string, message: string) {
      if (!auth.logging) {
        navigate("/login", { state: "/game" });
        notif.current?.showNotif(title, message, 5000);
      }
      setValid(false);
      return;
    }

    function other_error(title: string, message: string) {
      if (location.state) {
        navigate(location.state, { state: "/game" });
      } else {
        navigate("/", { state: "/game" });
      }
      notif.current?.showNotif(title, message, 5000);
      setValid(false);
      return;
    }

    async function get_info() {
      let tmp_joined = await getJoinedRoom();

      if ("code" in tmp_joined) {
        if (tmp_joined.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        } else if (tmp_joined.code === 404) {
          tmp_joined = { room: "", message: "" };
        } else {
          return other_error(
            "Error " + tmp_joined.code + ":",
            tmp_joined.response,
          );
        }
      } else if (tmp_joined.message === "lobby_failed") {
        return other_error(
          "Lobby Error",
          "Do you have another lobby already open?",
        );
      }

      if (tmp_joined.room !== "") {
        setJoined(tmp_joined.room);
        setValid(true);
        return;
      }

      const storedCode = localStorage.getItem("code");

      if (storedCode) {
        const validate = await validateRoom(storedCode);

        if (validate.code === 200) {
          setJoined(storedCode);
          setValid(true);
          return;
        }

        localStorage.removeItem("code");
      }

      const tmp_rooms = await listRooms();

      if ("code" in tmp_rooms) {
        if (tmp_rooms.code === 401) {
          return login_error("Authentication error:", "Please log in again.");
        }
        return other_error("Error " + tmp_rooms.code + ":", tmp_rooms.response);
      }

      setRooms(tmp_rooms);
      setValid(true);
    }
    get_info();
  }, [auth.logging, navigate, location.state, notif, refresh]);

  if (valid === null) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  function refreshLobby() {
    setRefresh(!refresh);
  }

  return (
    <>
      <div className="max-lg:hidden">
        {joined !== "" ? (
          <GameWebSocket key={joined} code={joined} setCode={setJoined} />
        ) : (
          <CreateOrJoin
            availableGames={rooms}
            refreshLobby={refreshLobby}
            setJoined={setJoined}
          />
        )}
      </div>
      <div className=" text-center lg:hidden flex mt-20 justify-center flex-col gap-6 mx-10">
        <p className="text-error font-bold">
          Sorry but this game is unavailabe on a small screen, go on a larger
          one to play our game!
        </p>
        <img
          className="h-50 max-w-50 mx-auto rounded-2xl"
          src="../../static/stitch-sorry.gif"
        />
      </div>
    </>
  );
}
