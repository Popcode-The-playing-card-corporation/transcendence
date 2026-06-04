import { useState, type SetStateAction } from "react"
import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";

export default function GameWebSocket({logged_in, logging, setIsInGame} : {logged_in : boolean, logging: boolean, setIsInGame: React.Dispatch<SetStateAction<boolean>>}) {
	const [inGame, setInGame] = useState(false);
	return (
		<>
		{inGame ? <GameMain setIsGamePage={setIsInGame} /> : <WaitingRoom setIsInGame={setIsInGame} logged_in={logged_in} logging={logging} setInGame={setInGame}/>}
		</>
	);
}
