import { useState, type SetStateAction } from "react"
import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";

export default function GameWebSocket({setIsInGame} : {setIsInGame: React.Dispatch<SetStateAction<boolean>>}) {
	const [inGame, setInGame] = useState(false);
	return (
		<>
		{inGame ? <GameMain setIsGamePage={setIsInGame} /> : <WaitingRoom setIsInGame={setIsInGame} setInGame={setInGame}/>}
		</>
	);
}
