import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";
import useWebSocketModule from "react-use-websocket";
import host from "../../api/http/host";
import { useAuth } from "../hooks/useAuth";
import { useNotif } from "../hooks/useNotif";
import { useState } from "react";
import { playerT } from "../../utils/type/playerType";

export default function GameWebSocket({code} : {code:string}) {

	const notif = useNotif();

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
			default: typeof useWebSocketModule;
		};
		const auth = useAuth();
		const private_room = 0; const public_room = 1; const friend_room = 2;
		const [mode, setMode] = useState(private_room);
		const [maxSize, setSize] = useState(2);
		const [listPlayer, setPlayers] = useState<playerT[]>([]);
		
		const { sendJsonMessage } = useWebSocket(auth.logged_in ? (host.ws + "room/" + code + '/') : null, {
			shouldReconnect: () => auth.logged_in ? true : false,
			reconnectAttempts: 30,
			reconnectInterval: 1000,
			
			heartbeat: {
				message: JSON.stringify({ type: "heartbeat" }),
				returnMessage: JSON.stringify({ type: "acknowledge" }),
				interval: 30000,
				timeout: 60000,
			},
	
			onOpen: () => {
			},
	
			onClose: () => {
			},

			onMessage: (event) => {
				const data = JSON.parse(event.data);
				if (data.type == "acknowledge") {
					return
				}
				const payload = data.payload;

				if (data.event === "private") {
					console.debug("Private event: ", payload);
				}
				else if (data.event === "event") {
					console.debug("Room event: ", payload);
				} else if (data.event === "error") {
					notif?.showNotif("Game Error", data.message);
				} else {
					console.debug("Unknown event: ", data)
				}
			},
	
		});

		function sendJson(action:string, message?:string) {
			sendJsonMessage({type: "action", action: action, message: message })
		}

		function startGame() {
			sendJson("start_game");
		}

		function playCard(cardId:number) {
			sendJson("play_card", JSON.stringify({cardId: cardId}));
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
			sendJson("melds", JSON.stringify(parsed_cards));
		}
		
		function kickPlayer(playerId:number) { //RoomId of player/ position
			sendJson("kick", JSON.stringify({playerId : playerId}));
		}

	
	return (
		<>
		{auth.in_game ? <GameMain playCard={playCard} continueGame={continueGame} endGame={endGame} annonces={annonces}/> 
		: <WaitingRoom roomCode={""} kickPlayer={kickPlayer} startGame={startGame} listPlayer={listPlayer} mode={mode} setMode={setMode} maxSize={maxSize} setSize={setSize}/>}
		</>
	);
}
