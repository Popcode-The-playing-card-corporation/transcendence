import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";
import useWebSocketModule from "react-use-websocket";
import host from "../../api/http/host";
import { useAuth } from "../hooks/useAuth";
import { useNotif } from "../hooks/useNotif";
import { useEffect, useState, type SetStateAction } from "react";
import { type playerT } from "../../utils/type/playerType";
import type { boardDataT } from "../../utils/type/boardDataType";
import { useNavigate } from "react-router";

export default function GameWebSocket({code, setCode} : {code:string; setCode:React.Dispatch<SetStateAction<string>>}) {
	
	const notif = useNotif();
	const auth = useAuth();
	const [mode, setMode] = useState(0);
	const [maxSize, setSize] = useState(2);
	const [listPlayer, setPlayers] = useState<playerT[]>([]);
	const [connected, setConnected] = useState(false);
	const [timeout, setTimeout] = useState(new Date(0,0,0));
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.setItem("code", code);
	}, [code]);

	function leaveRoom() {
		localStorage.removeItem("code");
		setCode("");
	}

	function getTime(datetime:string) {
		const dateTimeParts = datetime.split(' ');
		const time = dateTimeParts[1].split(':');
		const date = dateTimeParts[0].split('-');
		const res = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]), Number(time[0]), Number(time[1]), Number(time[2]))
		return res;
	}

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
			default: typeof useWebSocketModule;
		};
		
		const { sendJsonMessage } = useWebSocket(auth.logged_in ? (host.ws + "room/" + code + '/') : null, {
			shouldReconnect: (event) => {
				if (event.code === 4001) {
					leaveRoom();
					return false;
				} else if (event.code === 4003) {
					leaveRoom();
					navigate("/");
					return false;
				}
				return auth.logged_in ? true : false
			},
			reconnectAttempts: 30,
			reconnectInterval: 1000,
			
			heartbeat: {
				message: JSON.stringify({ type: "heartbeat" }),
				returnMessage: JSON.stringify({ type: "acknowledge" }),
				interval: 30000,
				timeout: 60000,
			},
	
			onOpen: () => {
				setConnected(true);
			},
	
			onClose: () => {
			},

			onMessage: (event) => {
				const data = JSON.parse(event.data);
				if (data.type == "acknowledge") {
					return
				}
				const payload = data.payload;

				if (data.type === "list_player") {
					setConnected(true);
					setPlayers(payload.players)
				}
				else if (data.type === "params") {
					setSize(payload.max_player);
					const type = payload.type;
					setMode(type === "private" ? 0 : type === "public" ? 2 : 1);
					setTimeout(getTime(payload.timestamp));
				} else if (data.type === "event") {
					if (data.event === "kicked") {
						leaveRoom();
					} else if (data.event === "board_data") {
						const board_data : boardDataT = data.payload;
						console.debug(board_data);
						auth.setGame(true);
					}
				} else if (data.type === "game_started") {
					auth.setGame(true);
				} else if (data.event === "error") {
					notif?.showNotif("Game Error", data.message);
				} else {
					console.debug("Unknown event: ", data)
				}
			},
	
		});

		function sendJson(action:string, message?:object) {
			sendJsonMessage({type: "action", action: action, payload: message })
		}

		function startGame() {
			sendJson("start_game");
		}

		function playCard(cardId:number) {
			sendJson("play_card", {cardId: cardId});
		}

		function continueGame() {
			sendJson("continue");
		}

		function endGame() {
			sendJson("end_game");
		}

		function annonces(cards: number[]) {
			const parsed_cards:{cardId:number}[] = [];
			cards.forEach((card) => {
				parsed_cards.push({cardId: card})
			})
			sendJson("melds", parsed_cards);
		}
		
		function kickPlayer(playerId:number) { //RoomId of player/ position
			sendJson("kick", {playerId : playerId});
		}

	if (connected === false)
	  return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>)
	
	return (
		<>
		{auth.in_game ? <GameMain board_data={board_data} playCard={playCard} continueGame={continueGame} endGame={endGame} annonces={annonces}/> 
		: <WaitingRoom timeout={timeout} leaveRoom={leaveRoom} roomCode={code} kickPlayer={kickPlayer} startGame={startGame} listPlayer={listPlayer} mode={mode} setMode={setMode} maxSize={maxSize} setSize={setSize}/>}
		</>
	);
}
