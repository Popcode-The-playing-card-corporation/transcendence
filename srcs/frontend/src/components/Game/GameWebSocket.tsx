import { useState, type SetStateAction } from "react"
import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";
import useWebSocketModule from "react-use-websocket";
import host from "../../api/http/host";
import { useAuth } from "../hooks/useAuth";

export default function GameWebSocket({code, setIsInGame} : {code:string; setIsInGame: React.Dispatch<SetStateAction<boolean>>}) {

	const [inGame, setInGame] = useState(false);

	const { default: useWebSocket = useWebSocketModule } = useWebSocketModule as unknown as {
			default: typeof useWebSocketModule;
		};
		const auth = useAuth();
		
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
				console.debug("Game websocket open");
			},
	
			onClose: () => {
				console.debug("Game websocket closed");
			},
	
		});

		function sendJson(action:string, message?:string) {
			sendJsonMessage({type: "action", action: action, message: message })
		}

		function startGame() {
			sendJson("start_game");
		}

		function playCard(cardID:number) {
			sendJson("play_card", String(cardID));
		}

		function continueGame() {
			sendJson("continue");
		}

		function endGame() {
			sendJson("end_game");
		}

		function endGame() {
			sendJson("end_game");
		}
	
	return (
		<>
		{inGame ? <GameMain setIsGamePage={setIsInGame} playCard={playCard}/> : <WaitingRoom setIsInGame={setIsInGame} setInGame={setInGame}/>}
		</>
	);
}
